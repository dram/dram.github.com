#!/usr/bin/env python
# -*- coding: utf-8 -*- #

import os.path
import datetime

SITENAME = 'dram.me'
SITEURL = 'http://dram.me'

AUTHOR = 'Xin Wang'
TIMEZONE = 'Asia/Shanghai'

DIRECT_TEMPLATES = []

RELATIVE_URLS = False
DEFAULT_PAGINATION = 5

PATH = '_sources'
ARTICLE_EXCLUDES = ('pages', 'theme')
FILENAME_METADATA = '(?P<date>\d{4}-\d{2}-\d{2})-(?P<slug>.*)'
PATH_METADATA = 'pages/(?P<dirname>.*)/(?P<slug>.*)\.'
EXTRA_PATH_METADATA = { 'pages/index.md': {'dirname': '.', 'slug': 'index'} }
THEME = os.path.abspath('_sources/theme')
OUTPUT_PATH = 'blog'

ARTICLE_URL = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}.html'
ARTICLE_SAVE_AS = '{date:%Y}/{date:%m}/{date:%d}/{slug}.html'

PAGE_URL = '/{dirname}/{slug}.html'
PAGE_SAVE_AS = '../{dirname}/{slug}.html'

TAG_SAVE_AS = ''
TAGS_SAVE_AS = ''
AUTHOR_SAVE_AS = ''
AUTHORS_SAVE_AS = ''
ARCHIVES_SAVE_AS = ''
CATEGORY_SAVE_AS = ''

FEED_ATOM = 'atom.xml'
FEED_ALL_ATOM = None
FEED_MAX_ITEMS = 10
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

COPYRIGHT_YEAR = datetime.datetime.now().year

PLUGINS = ['sam_reader']
