<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="posts">
    <article>
      <section id="posts">
        <h1>Blog Posts</h1>
        <ul class="article-list"><xsl:apply-templates/></ul>
        <p id="more"><a href="/blog/archive.html">more...</a></p>
      </section>

      <section id="projects">
        <h1>Projects</h1>
        <ul class="article-list">
          <li>...</li>
        </ul>
      </section>
    </article>
  </xsl:template>

  <xsl:template match="post">
    <li>
      <span>
        <xsl:value-of select="format-date(publication-date, '[D01] [MNn,3-3] [Y0001]')"/>
      </span>
      <span> &#187; </span>
      <a>
        <xsl:attribute name="href">
          <xsl:value-of select="uri"/>
        </xsl:attribute>
        <xsl:value-of select="title"/>
      </a>
    </li>
  </xsl:template>
</xsl:stylesheet>
