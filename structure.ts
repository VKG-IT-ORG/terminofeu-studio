import {
  AiFillEye,
  AiFillEdit,
  AiOutlineContainer,
  AiOutlineFileSearch,
  AiOutlineMessage,
  AiOutlineMergeCells,
} from 'react-icons/ai'
import { PiGavel } from 'react-icons/pi'

// TODO: Better preview
// import IframePreview from './custom-previews/web-preview/IframePreview'
import Review from './custom-previews/linguistic-review/Review'
import Comments from './custom-previews/comments/Comments'
import DocumentsPane from 'sanity-plugin-documents-pane'
import type {
  DefaultDocumentNodeResolver,
  StructureResolver,
} from 'sanity/structure'

import { langs } from './schemas/data/langs'
import { statusList } from './schemas/data/statusList'
import { ag } from './schemas/data/arbeitsgruppen'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType }
) => {
  if (schemaType === 'entry') {
    return S.document().views([
      S.view.form().icon(AiFillEdit),
      /*    S.view
        .component(IframePreview)
        .options({ addPreviewParam: true })
        .title('Vorschau')
        .icon(AiFillEye), */
      S.view.component(Comments).title('Kommentare').icon(AiOutlineMessage),
      S.view
        .component(Review)
        .title('Vergleich DE-FR')
        .icon(AiOutlineMergeCells),
    ])
  }

  if (schemaType === 'source') {
    return S.document().views([
      S.view.form().icon(AiFillEdit),
      S.view
        .component(DocumentsPane)
        .options({
          query: `*[!(_id in path("drafts.**")) && references($id) && _type == 'entry']`,
          params: { id: `_id` },
          useDraft: false,
        })
        .title('Einträge'),
    ])
  }
}

export const structure: StructureResolver = (S, { currentUser }) => {
  // Sanity user ids of translators and experts
  const translators = ['puCcAHT8N', 'pfoCdHT74']
  const experts = [...translators, 'pNqrbwTtv']

  const translationsItems = [
    S.listItem()
      .title('Traductions')
      .child(
        S.documentList()
          .id('translations')
          .title('Traductions')
          .apiVersion('v2024-01-24')
          .filter('_type == "entry" && translationStatus == "translation"')
          .defaultOrdering([{ field: 'deTitle', direction: 'asc' }])
      ),
    S.listItem()
      .title('Révisions')
      .child(
        S.documentList()
          .id('revisions')
          .title('Révisions')
          .apiVersion('v2024-01-24')
          .filter('_type == "entry" && translationStatus == "review"')
          .defaultOrdering([{ field: 'deTitle', direction: 'asc' }])
      ),
  ]

  const expertsItems = [
    S.listItem()
      .title('Vérifications')
      .child(
        S.documentList()
          .id('controls')
          .title('Vérifications')
          .apiVersion('v2024-01-24')
          .filter('_type == "entry" && translationStatus == "validation"')
          .defaultOrdering([{ field: 'deTitle', direction: 'asc' }])
      ),
    S.listItem()
      .title('Fiches validées')
      .child(
        S.documentList()
          .id('validated')
          .title('Fiches validées')
          .apiVersion('v2024-01-24')
          .filter('_type == "entry" && translationStatus == "fr_validated"')
          .defaultOrdering([{ field: 'deTitle', direction: 'asc' }])
      ),
  ]

  return S.list()
    .title('Inhalt')
    .items([
      S.listItem()
        .title('Einträge')
        .icon(AiOutlineContainer)
        .child(S.documentTypeList('entry')),
      S.listItem()
        .title('Einträge nach Status')
        .child(
          S.list()
            .title('Einträge nach Status')
            .items([
              ...statusList.map((status) => {
                return S.listItem()
                  .title(status.title)
                  .child(
                    S.documentList()
                      .title(status.title)
                      .apiVersion('v2024-01-24')
                      .filter('_type == "entry" && status == $status')
                      .params({ status: status.value })
                      .defaultOrdering([{ field: 'deTitle', direction: 'asc' }])
                  )
              }),
            ])
        ),
      S.listItem()
        .title('BSV 2026 Anhang 2')
        .icon(PiGavel)
        .child(
          S.documentList()
            .id('ioth')
            .title('BSV 2026 Anhang 2')
            .apiVersion('v2024-01-24')
            .filter('_type == "entry" && level == "IOTH"')
            .defaultOrdering([{ field: 'deTitle', direction: 'asc' }])
        ),
      S.listItem()
        .title('Arbeitsgruppen')
        .child(
          S.list()
            .title('Arbeitsgruppen')
            .items([
              ...ag.map((gruppe) => {
                return S.listItem()
                  .title(gruppe.title)
                  .child(
                    S.documentList()
                      .title(gruppe.title)
                      .apiVersion('v2024-01-24')
                      .filter('_type == "entry" && $ag in assignees')
                      .params({ ag: gruppe.value })
                      .defaultOrdering([{ field: 'deTitle', direction: 'asc' }])
                  )
              }),
            ])
        ),
      S.listItem()
        .title('Quellen')
        .icon(AiOutlineFileSearch)
        .child(
          S.list()
            .title('Quellen')
            .items([
              ...langs.map((lang) => {
                return S.listItem()
                  .title(lang.title)
                  .child(
                    S.documentList()
                      .title(lang.title)
                      .apiVersion('v2024-01-24')
                      .filter('_type == "source" && lang == $lang')
                      .params({ lang: lang.code })
                  )
              }),
            ])
        ),
      ...translationsItems,
      ...expertsItems,
      S.listItem()
        .title('Fiches à discuter')
        .child(
          S.documentList()
            .id('in_discussion')
            .title('Fiches à discuter')
            .apiVersion('v2024-01-24')
            .filter(
              '_type == "entry" && translationStatus == "fr_in_discussion"'
            )
            .defaultOrdering([{ field: 'deTitle', direction: 'asc' }])
        ),
    ])
}
