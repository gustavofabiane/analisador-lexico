function removeWord(elm) {
    
    var word = $(elm).data('remove');
    var input = $('input[name=in]').val();
    
    deleteWordFromDictionary(word, input);
}

$(document).ready(function() {
   
   /**
    * 
    * Leitura do campo de sentenças
    */
   $('input[name=in]').keyup(function(e) {
       read($(this).val());
   });
   
   $('#add-word-btn').click(function() {
      
      addWordToDictionary($('input[name=in]').val());
      
       $(this).attr("disabled", true);
   });
   
   $('#reset-analyzer').click(function() {
       
       resetAnalyzer();
   });
    
});


