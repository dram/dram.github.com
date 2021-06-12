import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Serve {
  private static final Logger LOGGER = Logger.getLogger(Serve.class.getName());

  private static class Handler implements HttpHandler {
    public void handle(HttpExchange exchange) throws IOException {
      String uri = exchange.getRequestURI().getPath();

      LOGGER.log(Level.INFO, exchange.getRequestMethod() + " " + uri);

      if (uri.endsWith("/")) {
        uri = uri + "index.html";
      }

      if (uri.endsWith(".html")) {
        try {
          Build.main(new String[] {});
        } catch (Exception e) {
          LOGGER.log(Level.SEVERE, "Build failed", e);
        }
      }

      exchange.sendResponseHeaders(200, 0);

      try (OutputStream output = exchange.getResponseBody()) {
        output.write(Files.readAllBytes(Paths.get("." + uri)));
      }
    }
  }

  public static void main(String[] args) throws IOException {
    HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

    LOGGER.log(Level.INFO, "Serving 0.0.0.0:8000");

    server.createContext("/", new Handler());

    server.start();
  }
}
