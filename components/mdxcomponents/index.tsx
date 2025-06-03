import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import Audioplayer from './Audioplayer'
import WebsiteEmbed from './WebsiteEmbed'

export const components: MDXComponents = {
  Image,
  a: CustomLink,
  table: TableWrapper,
  Audioplayer,
  WebsiteEmbed,
}
