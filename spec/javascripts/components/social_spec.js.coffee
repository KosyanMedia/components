describe 'Social Sharing', ->
  beforeEach ->
    angular.mock.module('Components')

  describe 'generate content', ->
    beforeEach ->
      inject ($rootScope, $compile) =>
        scope = $rootScope.$new()
        #HACK add provider to scope for specs only, in real code in will be taken from element
        scope.provider = 'twitter';
        template = $compile(
          '<social id="test_element" provider="twitter" url="http://test.url" message="Test message" />'
        )
        $('body').append($compile(template($rootScope))(scope))
        scope.$digest()

    afterEach ->
      $('#test_element').remove()

    it 'should generate social button div', ->
      expect(
        $('#test_element.tooltip-content__auth-button.tooltip-content__auth-button-twitter .tooltip-content__auth-button-img').length
      ).toBe(1)

    #FIXME add check for provider sharing window opened
    xit 'should add click handler', ->
      spyOn window, 'open'

      $('#test_element').click()

      expect(window.open).toHaveBeenCalledWith(
        "http://twitter.com/intent/tweet?text=Test%20message&url=#{encodeURIComponent('http://test.url')}",
        'Sharing', 'width=740,height=440'
      )
