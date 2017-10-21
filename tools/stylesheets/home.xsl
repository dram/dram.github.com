<xsl:stylesheet version="1.0"
                extension-element-prefixes="date"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:date="http://exslt.org/dates-and-times"
                xmlns="http://www.w3.org/1999/xhtml">
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
          <li><a href="https://github.com/dram/docs/">github.com/dram/docs</a>：一些关于 Linux 应用和开发的个人笔记整理；</li>
          <li><a href="https://github.com/dram/etoyscn">EtoysCN</a>：完善 Etoys 的中文支持，维护 <a href="http://squeakcn.wordpress.com/">SqueakCN</a> 博客；</li>
          <li><a href="http://translate.sugarlabs.org/zh_CN/">SugarLabs Translation</a>：SugarLabs 项目的中文汉化工作；</li>
          <li><a href="https://github.com/dram/configs/blob/master/.uim.d/plugin/zhengma.scm">uim-zhengma</a>：uim 的郑码输入法模块；</li>
          <li><a href="https://github.com/dram/configs/blob/master/bin/vim-mpg123.py">vim-mpg123</a>：基于 mpg123 和 Vim 的简单音频播放器；</li>
          <li><a href="https://github.com/dram/crux">CRUX Pkgfiles</a>：一些 CRUX Linux 的包描述。</li>
        </ul>
      </section>
    </article>
  </xsl:template>

  <xsl:template match="post">
    <li>
      <span>
        <xsl:variable name="date" select="creation-date"/>
        <xsl:variable name="year" select="date:year($date)"/>
        <xsl:variable name="month" select="date:month-abbreviation($date)"/>
        <xsl:variable name="day" select="date:day-in-month($date)"/>
        <xsl:value-of select="concat(format-number($day, '00'), ' ', $month, ' ', $year)"/>
      </span>
      &#187;
      <a>
        <xsl:attribute name="href">
          <xsl:value-of select="uri"/>
        </xsl:attribute>
        <xsl:value-of select="title"/>
      </a>
    </li>
  </xsl:template>
</xsl:stylesheet>
