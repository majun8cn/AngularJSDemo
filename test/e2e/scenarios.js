describe('PhoneCat App', function() {
 
  describe('Phone list view', function() {
 
    beforeEach(function() {
      browser.get('http://localhost:8000/app/index.html');
    });
 
    var phoneList = element.all(by.repeater('phone in phones'));
    var query = element(by.model('query'));

    it('should filter the phone list as user types into the search box', function() {
      expect(phoneList.count()).toBe(20);

      query.sendKeys('nexus');
      expect(phoneList.count()).toBe(1);

      query.clear();
      query.sendKeys('motorola');
      expect(phoneList.count()).toBe(8);
    });
 
    it('should display the current filter value in the title bar', function() {
      query.clear();
      expect(browser.getTitle()).toMatch(/Google Phone Gallery:\s*$/);

      query.sendKeys('nexus');
      expect(browser.getTitle()).toMatch(/Google Phone Gallery:$/);
    });
       
	it('should display the current filter value within an element with id "status"', function() {
	  var status = element(by.id('status'));
	  expect(status.getText()).toMatch(/Current filter:$/);
	 
	  query.sendKeys('nexus');
	 
	  expect(status.getText()).toMatch(/Current filter: nexus\s*$/);
 
	});

    it('should be possible to control phone order via the drop down select box', function() {

  		var phoneNameColumn = element.all(by.repeater('phone in phones').column('phone.name'));
  		var query = element(by.model('query'));

  		function getNames() {
    			return phoneNameColumn.map(function(elm) {
      			return elm.getText();
    		});
  		}

  		query.sendKeys('tablet'); //let's narrow the dataset to make the test assertions shorter

  		expect(getNames()).toEqual([
    		"Motorola XOOM\u2122 with Wi-Fi",
    		"MOTOROLA XOOM\u2122"
  		]);

  		element(by.model('orderProp')).element(by.css('option[value="name"]')).click();

  		expect(getNames()).toEqual([
    		"MOTOROLA XOOM\u2122",
    		"Motorola XOOM\u2122 with Wi-Fi"
  		]);
	});

    it('should render phone specific links', function() {
      var query = element(by.model('query'));
      query.sendKeys('nexus');
      element.all(by.css('.phones li a')).first().click();
      browser.getLocationAbsUrl().then(function(url) {
        expect(url.split('#')[1]).toBe('/phones/nexus-s');
      });
    });
    
    it('should redirect index.html to index.html#/phones', function() {
    	browser.get('http://localhost:8000/app/index.html');
    	browser.getLocationAbsUrl().then(function(url) {
        	expect(url.split('#')[1]).toBe('/phones');
      	});
  	});
  	
  });
  
  describe('Phone detail view', function() {
 
    beforeEach(function() {
      browser.get('http://localhost:8000/app/index.html#/phones/nexus-s');
    });
 
    it('should display nexus-s page', function() {
    	expect(element(by.binding('name')).getText()).toBe('Nexus S');
    });
    
    it('should display the first phone image as the main phone image', function() {
      expect(element(by.css('img.phone')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
    });

    it('should swap main image if a thumbnail image is clicked on', function() {
      element(by.css('.phone-thumbs li:nth-child(3) img')).click();
      expect(element(by.css('img.phone')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);

      element(by.css('.phone-thumbs li:nth-child(1) img')).click();
      expect(element(by.css('img.phone')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
    });
    
  });  
    
});