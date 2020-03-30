// autoprefixer - https://github.com/postcss/autoprefixer
// postcss-sort-media-queries - https://github.com/dutchenkoOleg/sort-css-media-queries
// cssnano      - https://github.com/hail2u/node-css-mqpacker

// npm install postcss-loader autoprefixer css-mqpacker cssnano --save-dev

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-sort-media-queries')({
      sort: 'desktop-first'
    }),
    require('cssnano')({
      preset: [
        'default', {
          discardComments: {
            removeAll: true
          }
        }
      ]
    })
  ]
}
