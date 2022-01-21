import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Optional;
import java.util.Vector;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.tools.ant.DefaultLogger;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.ProjectHelper;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

class Build {
  private static final Logger LOGGER = Logger.getLogger(Build.class.getName());

  private static class Post {
    Path source;
    Path target;
    String date;
    String name;
    String title;

    public Post(final Path source)
        throws IOException, ParserConfigurationException, SAXException, XPathExpressionException {
      this.source = source;

      String fileName = source.getFileName().toString();
      this.name = fileName.substring(11, fileName.lastIndexOf('.'));
      this.date = fileName.substring(0, 10);

      this.target = Paths.get("blog", this.date.replace('-', '/')).resolve(this.name + ".html");

      this.title = getTitle(source);
    }
  }

  private static Document getArticleDocument(final Path path)
      throws IOException, ParserConfigurationException, SAXException, XPathExpressionException {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    factory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
    DocumentBuilder builder = factory.newDocumentBuilder();
    Document source = builder.parse(path.toString());

    XPath xpath = XPathFactory.newInstance().newXPath();

    XPathExpression expression = xpath.compile("//body/child::node()");
    NodeList nodes = (NodeList) expression.evaluate(source, XPathConstants.NODESET);

    Document target = builder.newDocument();

    Element rootElement = target.createElement("article");
    target.appendChild(rootElement);

    for (int i = 0; i < nodes.getLength(); ++i) {
      Node node = nodes.item(i);
      target.adoptNode(node);
      rootElement.appendChild(node);
    }

    return target;
  }

  private static Document getPostListDocument(
      final Vector<Post> posts, final Optional<Integer> limit)
      throws IOException, ParserConfigurationException {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    DocumentBuilder builder = factory.newDocumentBuilder();
    Document document = builder.newDocument();

    Element rootElement = document.createElement("posts");
    document.appendChild(rootElement);

    for (Post post :
        (limit.isPresent() ? posts.subList(0, Math.min(limit.get(), posts.size())) : posts)) {
      Element element = document.createElement("post");
      rootElement.appendChild(element);

      Element titleElement = document.createElement("title");
      element.appendChild(titleElement);
      titleElement.appendChild(document.createTextNode(post.title));

      Element creationDateElement = document.createElement("publication-date");
      element.appendChild(creationDateElement);
      creationDateElement.appendChild(document.createTextNode(post.date));

      Element uriElement = document.createElement("uri");
      element.appendChild(uriElement);
      uriElement.appendChild(document.createTextNode("/" + post.target));
    }

    return document;
  }

  private static String getTitle(final Path path)
      throws IOException, ParserConfigurationException, SAXException, XPathExpressionException {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    factory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
    Document document = factory.newDocumentBuilder().parse(path.toString());

    return XPathFactory.newInstance().newXPath().compile("//topic/title/text()").evaluate(document);
  }

  private static boolean isModified(final Path source, final Path target) {
    try {
      return Files.readAttributes(source, BasicFileAttributes.class)
              .lastModifiedTime()
              .compareTo(Files.readAttributes(target, BasicFileAttributes.class).lastModifiedTime())
          > 0;
    } catch (IOException e) {
      return true;
    }
  }

  public static void main(final String[] args)
      throws IOException, ParserConfigurationException, SAXException,
          TransformerConfigurationException, TransformerException, XPathExpressionException {
    final FilenameFilter ditaFilenameFilter =
        new FilenameFilter() {
          public boolean accept(File dir, String name) {
            return !name.startsWith(".") && name.endsWith(".dita") && !name.endsWith(".draft.dita");
          }
        };

    for (String directory : new String[] {"blog", "logo"}) {
      for (File entry :
          Paths.get("_sources/pages").resolve(directory).toFile().listFiles(ditaFilenameFilter)) {
        Path source = entry.toPath();
        Path target =
            Paths.get(directory).resolve(FilenameUtils.removeExtension(entry.getName()) + ".html");

        if (isModified(source, target)) {
          LOGGER.log(Level.INFO, "Rendering page (" + source.getFileName().toString() + ") ...");

          renderLayout(new DOMSource(renderDita(source)), target, getTitle(source));
        }
      }
    }

    final Vector<Post> posts = new Vector<>();

    for (File source : new File("_sources/posts").listFiles(ditaFilenameFilter)) {
      Post post = new Post(source.toPath());

      posts.add(post);
    }

    Collections.sort(
        posts,
        new Comparator<Post>() {
          public int compare(Post post1, Post post2) {
            return -post1.source.compareTo(post2.source);
          }
        });

    boolean hasNewPost = false;

    for (Post post : posts) {
      if (isModified(post.source, post.target)) {
        hasNewPost = true;
        LOGGER.log(
            Level.INFO, "Rendering post page (" + post.source.getFileName().toString() + ") ...");

        renderPost(new DOMSource(renderDita(post.source)), post);
      }
    }

    if (posts.isEmpty() || hasNewPost) {
      LOGGER.log(Level.INFO, "Rendering home page ...");

      renderHome(
          new DOMSource(getPostListDocument(posts, Optional.of(10))), Paths.get("index.html"));

      LOGGER.log(Level.INFO, "Rendering archive page ...");

      renderArchive(
          new DOMSource(getPostListDocument(posts, Optional.empty())),
          Paths.get("blog/archive.html"));
    }
  }

  private static void renderArchive(final DOMSource posts, final Path output)
      throws IOException, TransformerConfigurationException, TransformerException {
    TransformerFactory factory = TransformerFactory.newInstance();
    Transformer transformer =
        factory.newTransformer(new StreamSource(new File("tools/stylesheets/archive.xsl")));
    DOMResult result = new DOMResult();
    transformer.transform(posts, result);
    renderLayout(new DOMSource(result.getNode()), output, "Archive");
  }

  private static Document renderDita(final Path source)
      throws IOException, ParserConfigurationException, SAXException, XPathExpressionException {
    Project project = new Project();

    DefaultLogger logger = new DefaultLogger();
    logger.setMessageOutputLevel(Project.MSG_INFO);
    logger.setOutputPrintStream(System.out);
    logger.setErrorPrintStream(System.err);
    project.addBuildListener(logger);

    LOGGER.log(Level.INFO, "Loading project configuration ...");

    ProjectHelper.configureProject(project, new File("tools/dita-ot-3.7/build.xml"));

    Path workingDirectory = Files.createTempDirectory(Paths.get("/dev/shm"), "dita");

    project.setProperty("args.xhtml.classattr", "no");
    project.setProperty("args.input", source.toAbsolutePath().toString());
    project.setProperty("dita.temp.dir", workingDirectory.toString());
    project.setProperty("output.dir", workingDirectory.toString());

    LOGGER.log(Level.INFO, "Executing targets ...");

    String[] targets = {"dita2xhtml.init", "build-init", "preprocess", "xhtml.topics"};

    project.executeTargets(new Vector<String>(Arrays.asList(targets)));

    Document document =
        getArticleDocument(
            workingDirectory.resolve(
                FilenameUtils.removeExtension(source.getFileName().toString()) + ".html"));

    FileUtils.deleteDirectory(workingDirectory.toFile());

    return document;
  }

  private static void renderHome(final DOMSource posts, final Path output)
      throws IOException, TransformerConfigurationException, TransformerException {
    TransformerFactory factory = TransformerFactory.newInstance();
    Transformer transformer =
        factory.newTransformer(new StreamSource(new File("tools/stylesheets/home.xsl")));
    DOMResult result = new DOMResult();
    transformer.transform(posts, result);
    renderLayout(new DOMSource(result.getNode()), output, "dram.me");
  }

  private static void renderLayout(final DOMSource contents, final Path output, String title)
      throws IOException, TransformerConfigurationException, TransformerException {
    LOGGER.log(Level.INFO, String.format("Rendering layout (%s)...", title));

    TransformerFactory factory = TransformerFactory.newInstance();

    Transformer transformer =
        factory.newTransformer(new StreamSource(new File("tools/stylesheets/layout.xsl")));

    transformer.setOutputProperty("indent", "no");
    transformer.setParameter("title", title);

    transformer.transform(contents, new StreamResult(output.toFile()));
  }

  private static void renderPost(final DOMSource article, final Post post)
      throws IOException, TransformerConfigurationException, TransformerException {
    TransformerFactory factory = TransformerFactory.newInstance();
    Transformer transformer =
        factory.newTransformer(new StreamSource(new File("tools/stylesheets/post.xsl")));

    transformer.setParameter("publication-date", post.date);

    DOMResult result = new DOMResult();
    transformer.transform(article, result);
    renderLayout(new DOMSource(result.getNode()), post.target, post.title);
  }

}
