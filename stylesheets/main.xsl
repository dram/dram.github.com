<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:html="http://www.w3.org/1999/xhtml"
                xmlns="http://www.w3.org/1999/xhtml">

  <xsl:variable name="title" select="/html:article/html:h1"/>

  <xsl:template match="/">
    <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" href="/css/main.css"/>
        <link rel="shortcut icon" href="/images/favicon.png"/>
        <title><xsl:value-of select="$title"/></title>
      </head>

      <body>
        <header>
          <span id="site-name"><a href="/">dram.me</a></span>
          <nav>
            <ul>
                <xsl:element name="li">
                  <xsl:if test="$title = 'About'">
                    <xsl:attribute name="class">selected</xsl:attribute>
                  </xsl:if>
                  <a href="/blog/about.html">About</a>
                </xsl:element>
                <xsl:element name="li">
                  <xsl:if test="$title = 'LOGO画板'">
                    <xsl:attribute name="class">selected</xsl:attribute>
                  </xsl:if>
                  <a href="/logo/">LOGO</a>
                </xsl:element>
            </ul>
          </nav>
        </header>

        <xsl:copy-of select="/"></xsl:copy-of>

        <footer>
          <p>Copyright &#169; 2007&#8211;<xsl:value-of select="$current-year"/> Xin Wang</p>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
