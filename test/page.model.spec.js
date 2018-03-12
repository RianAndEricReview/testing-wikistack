const expect = require('chai').expect
var chai = require('chai')
var spies = require('chai-spies')
chai.use(spies)
const Page = require('../models').Page

describe('Page model', function () {
  describe('page creation', function() {
    let builtPage
    it('builds a new page', function() {
      builtPage = Page.build({
        title: 'The title',
        content: 'the content',
        status: 'closed'
      })
      expect(builtPage.title).to.exist
      expect(builtPage.content).to.equal('the content')
      expect(builtPage.status).to.be.oneOf(['open', 'closed'])
    })
  })
});

//   describe('Virtuals', function () {
//     describe('route', function () {
//       it('returns the urlTitle prepended by "/wiki/"');
//     });
//     describe('renderedContent', function () {
//       it('converts the markdown-formatted content into HTML');
//     });
//   });

//   describe('Class methods', function () {
//     describe('findByTag', function () {
//       it('gets pages with the search tag');
//       it('does not get pages without the search tag');
//     });
//   });

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
