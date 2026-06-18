import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
  typographer: true,
})

md.renderer.rules.table_open = () => {
  return `

    <div class="custom-table-container"><table>
  `
};
md.renderer.rules.table_close = () => {
  return `
    </table></div>

  `
} 

export { md }