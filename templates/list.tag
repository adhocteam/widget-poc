<list>
  <doctors-page></doctors-page>
  <scrips-page></scrips-page>
  <facilities-page></facilities-page>
  <div class="nav">
    <a href="javascript:;" onclick={navToSearch}>Add</a>
  </div>
  <script>
    navToSearch = function(){
      riot.route('search');
    }
  </script>
</list>
