import { type SchemaTypeDefinition } from 'sanity'
import { aboutType } from './about'
import { heroType } from './hero'
import { menuType } from './menu'
import { contactType } from './contact'
import { comingSoonType } from './comingSoon'
import { siteSettingsType } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    aboutType,
    heroType,
    menuType,
    contactType,
    comingSoonType,
    siteSettingsType,
  ],
}
