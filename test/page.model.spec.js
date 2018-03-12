const expect = require('chai').expect
var chai = require('chai')
var spies = require('chai-spies')
chai.use(spies)
const Page = require('../models').Page

describe('Page model', function () {
  let builtPage
  let title = 'the title'
  let content = '# the content'
  let status = 'closed'
  let urlTitle = 'the_title'
  let tags = ['the', 'content']
  beforeEach(function() {
    builtPage = Page.build({
      title,
      content,
      status,
      urlTitle
    })
  })

  describe('page creation', function() {
    it('builds a new page', function() {
      expect(builtPage.title).to.exist
      expect(builtPage.content).to.equal(content)
      expect(builtPage.status).to.be.oneOf(['open', 'closed'])
    })
  })

  describe('Virtuals', function () {
    // describe('set urlTitle', function () {
    //   it('sets a urlTitle on a newly created page', function() {
    //     expect(builtPage.urlTitle).to.equal('the_title')
    //   })
    // })
    describe('route', function () {
      it('returns the urlTitle prepended by "/wiki/"', function() {
        expect(builtPage.route).to.equal('/wiki/the_title')
      })
    });

    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function() {
        expect(builtPage.renderedContent.trim()).to.equal('<h1 id="the-content">the content</h1>')
      })
    })
  })

  describe('Class methods', function () {
    before(function(done) {
      Page.create({
        title,
        content,
        status,
        urlTitle,
        tags
      })
      .then(function() {
        done()
      })
      .catch(done)
    })

    after(function(done) {
      Page.sync({force: true})
      done()
    })

    describe('findByTag', function () {
      it('gets pages with the search tag', function(done) {
        Page.findByTag('the')
        .then(function(pageArr) {
          expect(pageArr.length).to.equal(1)
          done()
        })
      })

      it('does not get pages without the search tag', function(done) {
        Page.findByTag('scooby')
        .then(function(pageArr) {
          expect(pageArr.length).to.equal(0)
          done()
        })
      })
    })
  })


});



//   describe('Instance methods', function () {
//     describe('findSimilar', function () {
//       it('never gets itself');
//       it('gets other pages with any common tags');
//       it('does not get other pages without any common tags');
//     });
//   });

//   describe('Validations', function () {
//     it('errors without title');
//     it('errors without content');
//     it('errors given an invalid status');
//   });

//   describe('Hooks', function () {
//     it('it sets urlTitle based on title before validating');
//   });

// });
