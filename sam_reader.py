# SAM reader for Pelican.

import logging
import os
import sys

import lxml
import pelican

sys.path.append('sam')

import samparser

sam_parser = samparser.SamParser()

sam_to_html = lxml.etree.XSLT(
    lxml.etree.XML('''
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output omit-xml-declaration="yes"/>

  <xsl:template match="/article/title"/>

  <xsl:template match="codeblock">
    <pre><code><xsl:apply-templates/></code></pre>
  </xsl:template>

  <xsl:template match="codeblock/text()">
    <xsl:value-of select="substring(., 2, string-length() - 2)"/>
  </xsl:template>

  <xsl:template match="annotation[@type='bold']">
    <strong><xsl:apply-templates/></strong>
  </xsl:template>

  <xsl:template match="code">
    <code><xsl:apply-templates/></code>
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

  <xsl:template match="insert[@type='image']">
    <img>
      <xsl:attribute name="src">
        <xsl:value-of select="@item"/>
      </xsl:attribute>
    </img>
  </xsl:template>

  <xsl:template match="li"><li><xsl:apply-templates/></li></xsl:template>

  <xsl:template match="ll"><dl><xsl:apply-templates/></dl></xsl:template>
  <xsl:template match="ll/li"><xsl:apply-templates/></xsl:template>
  <xsl:template match="ll/li/p">
    <dd><xsl:apply-templates/></dd>
  </xsl:template>
  <xsl:template match="ll/li/label">
    <dt><xsl:apply-templates/></dt>
  </xsl:template>

  <xsl:template match="blockquote">
    <blockquote><xsl:apply-templates/></blockquote>
  </xsl:template>
  <xsl:template match="ol"><ol><xsl:apply-templates/></ol></xsl:template>
  <xsl:template match="p"><p><xsl:apply-templates/></p></xsl:template>
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
  <xsl:template match="ul"><ul><xsl:apply-templates/></ul></xsl:template>
</xsl:stylesheet>
'''))

class SamReader(pelican.readers.BaseReader):
    enabled = True
    file_extensions = ['sam']

    def read(self, filename):
        metadata = {'date': os.path.basename(filename)[0:10]}

        try:
            sam_parser.parse(open(filename))
            xml = lxml.etree.fromstring(
                ''.join(sam_parser.serialize('xml')).encode('utf-8'))

            metadata['title'] = xml.xpath('/article/title')[0].text
            tags = xml.xpath('/article/tags')
            if tags:
                metadata['tags'] = tags[0].text
                tags[0].getparent().remove(tags[0])

            content = str(sam_to_html(xml))
        except:
            logging.exception("parse sam file error: {}".format(filename))

        for key, value in metadata.items():
            metadata[key] = self.process_metadata(key, value)

        return content, metadata

def add_reader(readers):
    readers.reader_classes['sam'] = SamReader

def register():
    pelican.signals.readers_init.connect(add_reader)
