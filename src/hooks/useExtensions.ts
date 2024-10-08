import type { EditorOptions } from '@tiptap/core'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Color from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import FontFamily from '@tiptap/extension-font-family'
import Gapcursor from '@tiptap/extension-gapcursor'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import History from '@tiptap/extension-history'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { useMemo } from 'react'

import FontSize from '@/extensions/FontSize'
import { Indent } from '@/extensions/Indent'
import LinkBubbleMenuHandler from '@/extensions/LinkBubbleMenuHandler'
import Table from '@/extensions/Table/Table'
import { TableCellBackground } from '@/extensions/Table/TableCellBackground'
export type UseExtensionsOptions = {
    placeholder?: string
}

// Don't treat the end cursor as "inclusive" of the Link mark, so that users can
// actually "exit" a link if it's the last element in the editor (see
// https://tiptap.dev/api/schema#inclusive and
// https://github.com/ueberdosis/tiptap/issues/2572#issuecomment-1055827817).
// This also makes the `isActive` behavior somewhat more consistent with
// `extendMarkRange` (as described here
// https://github.com/ueberdosis/tiptap/issues/2535), since a link won't be
// treated as active if the cursor is at the end of the link. One caveat of this
// approach: it seems that after creating or editing a link with the link menu
// (as opposed to having a link created via autolink), the next typed character
// will be part of the link unexpectedly, and subsequent characters will not be.
// This may have to do with how we're using `insertContent` and `setLink` in
// the LinkBubbleMenu, but I can't figure out an alternative approach that
// avoids the issue. This is arguably better than being "stuck" in the link
// without being able to leave it, but it is still not quite right. See the
// related open issues here:
// https://github.com/ueberdosis/tiptap/issues/2571,
// https://github.com/ueberdosis/tiptap/issues/2572, and
// https://github.com/ueberdosis/tiptap/issues/514
const CustomLinkExtension = Link.extend({
    inclusive: false,
})

const CustomSubscript = Subscript.extend({
    excludes: 'superscript',
})

const CustomSuperscript = Superscript.extend({
    excludes: 'subscript',
})
export default function useExtensions({
    placeholder,
}: UseExtensionsOptions): EditorOptions['extensions'] {
    return useMemo(() => {
        return [
            Table.configure({
                resizable: true,
            }),
            TableCellBackground,
            TableRow,
            TableHeader,
            TableCell,

            CustomSubscript,
            CustomSuperscript,

            BulletList,
            CodeBlock,
            Document,
            HardBreak,
            ListItem,
            OrderedList,
            Paragraph,
            Text,
            Heading,
            Bold,
            Blockquote,
            Code,
            Italic,
            Underline,
            Strike,
            CustomLinkExtension.configure({
                openOnClick: false,
            }),
            LinkBubbleMenuHandler,

            // Extensions
            Indent,
            Gapcursor,
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            Highlight.configure({ multicolor: true }),
            HorizontalRule,

            // When images are dragged, we want to show the "drop cursor" for where they'll
            // land
            Dropcursor,

            TaskList,
            TaskItem.configure({
                nested: true,
            }),

            Placeholder.configure({
                placeholder,
            }),

            // We use the regular `History` (undo/redo) extension when not using
            // collaborative editing
            History,
        ]
    }, [placeholder])
}
