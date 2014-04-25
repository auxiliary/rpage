rpage
=====

Highly responsive pagination for Bootstrap


Usage
=====

Just include `responsive-pagination.js` and call the `rPage` function on the pagination element like this:

    $(document).ready(function () {
        $(".pagination").rPage();
    }); 
    
Previous and Next Links
=======================

rPage won't hide previous and next links with bootstrap's default "«" and "»" content. If you want to use custom text in
your links, add classes to your list items like this:

    <ul class="pagination">
      <li class="pagination-prev"><a href="#">Previous</a></li>
      <!-- ... ->
      <li class="pagination-next"><a href="#">Next</a></li>
    </ul>
