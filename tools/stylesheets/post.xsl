<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:mode on-no-match="shallow-copy"/>

  <xsl:param name="publication-date"/>

  <xsl:template match="h1">
    <xsl:copy-of select="."/>
    <time><xsl:value-of select="format-date($publication-date, '[D01] [MNn,3-3] [Y0001]')"/></time>
  </xsl:template>

</xsl:stylesheet>
