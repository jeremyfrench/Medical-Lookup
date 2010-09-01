//alert(jQuery("input.edit-search-field").autocomplete);

// TODO: drupal attachbehaviours.
Drupal.behaviors.diseaselookup = {
  attach: function(context,settings) {
	jQuery("input#edit-search-field").autocomplete({
	    source: function(request,response) {
          jQuery.ajax({
        	url: 'http://'+ location.host + '/sparql/',
        	dataType: "json",
        	
        	data: {
        	  query: "SELECT Distinct ?id  ?title WHERE { " +
        	                       " ?id <http://www.w3.org/2004/02/skos/core#prefLabel> ?pref_title"+
        						   "{ ?id <http://www.w3.org/2004/02/skos/core#prefLabel> ?title }" +
        						   "UNION" +
        	                  "{ ?id <http://www.w3.org/2004/02/skos/core#altLabel> ?title." +
        	                  "   } "+
        	                  "?id <http://www.w3.org/2004/02/skos/core#broader> ?parent."+
        	                  "?parent <http://www.nlm.nih.gov/mesh/2006#runningHead> ?parent_head."+
        	                  "Filter Regex(?title,'"+request.term.toLowerCase()+"','i')."+
        	                  "FILTER regex(?parent_head,'^C[0-9]{1,2}')}  LIMIT 25"
        	                  
             },
        	beforeSend: function(request) {
        	  request.setRequestHeader('Accept',"application/sparql-results+json");
			},
        	async: true,
        	success: function(data, textStatus, XMLHttpRequest){
        	  var retval = new Array();
        	  response(jQuery.map(data.results.bindings, function(item) {
					return  item.title.value;
        	  }	
             ));
  
			},
        	error: function(data, textStatus, XMLHttpRequest){
        	  alert(data);
			},
          })
	   },
	    minLength: 2,
	    delay: 50,
	    select: function(event, ui) {
     	 window.location.href = 'http://' + location.host + '/disease/' + ui.item.value;
         },
	})}};
  


