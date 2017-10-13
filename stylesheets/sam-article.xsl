<xsl:stylesheet version="1.0"
                extension-element-prefixes="date"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:date="http://exslt.org/dates-and-times"
                xmlns="http://www.w3.org/1999/xhtml">
  <xsl:template match="article">
    <article>
      <h1><xsl:value-of select="/article/title"/></h1>
      <time>
        <xsl:variable name="year" select="date:year($date)"/>
        <xsl:variable name="month" select="date:month-abbreviation($date)"/>
        <xsl:variable name="day" select="date:day-in-month($date)"/>
        <xsl:value-of select="concat($day, ' ', $month, ' ', $year)"/>
      </time>
      <xsl:apply-templates/>
    </article>
  </xsl:template>

  <xsl:template match="article/title"/>

  <xsl:template match="section">
    <section><xsl:apply-templates/></section>
  </xsl:template>
  <xsl:template match="article/section/section/title">
    <h3><xsl:apply-templates/></h3>
  </xsl:template>
  <xsl:template match="article/section/title">
    <h2><xsl:apply-templates/></h2>
  </xsl:template>

  <xsl:template match="topic">
    <section>
      <xsl:attribute name="class">topic</xsl:attribute>
      <xsl:apply-templates/>
    </section>
  </xsl:template>
  <xsl:template match="article/topic/title">
    <h2><xsl:apply-templates/></h2>
  </xsl:template>

  <xsl:template match="codeblock">
    <pre><code><xsl:apply-templates/></code></pre>
  </xsl:template>

  <xsl:template match="codeblock/text()">
    <xsl:value-of select="substring(., 2, string-length() - 2)"/>
  </xsl:template>

  <xsl:template match="annotation[@type='bold']">
    <strong><xsl:apply-templates/></strong>
  </xsl:template>

  <xsl:template match="annotation[@type='italic']">
    <em><xsl:apply-templates/></em>
  </xsl:template>

  <xsl:template match="annotation[@type='link']">
    <a>
      <xsl:attribute name="href">
        <xsl:value-of select="@specifically"/>
      </xsl:attribute>
      <xsl:apply-templates/>
    </a>
  </xsl:template>

  <xsl:template match="code">
    <code><xsl:apply-templates/></code>
  </xsl:template>

  <xsl:template match="insert[@type='image']">
    <img>
      <xsl:attribute name="src">
        <xsl:value-of select="@item"/>
      </xsl:attribute>
    </img>
  </xsl:template>

  <xsl:template match="ol">
    <ol><xsl:apply-templates/></ol>
  </xsl:template>

  <xsl:template match="ul">
    <ul><xsl:apply-templates/></ul>
  </xsl:template>

  <xsl:template match="li">
    <li><xsl:apply-templates/></li>
  </xsl:template>

  <xsl:template match="ll">
    <dl><xsl:apply-templates/></dl>
  </xsl:template>

  <xsl:template match="ll/li">
    <xsl:apply-templates/>
  </xsl:template>
  <xsl:template match="ll/li/p">
    <dd><xsl:apply-templates/></dd>
  </xsl:template>
  <xsl:template match="ll/li/label">
    <dt><xsl:apply-templates/></dt>
  </xsl:template>

  <xsl:template match="blockquote">
    <blockquote><xsl:apply-templates/></blockquote>
  </xsl:template>
  <xsl:template match="p">
    <p><xsl:apply-templates/></p>
  </xsl:template>
</xsl:stylesheet>
