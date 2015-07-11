<facilities-page>
  <h3>Facilities</h3>
  <ul class="facilities-list" if={collection.length}>
    <li each={collection}>
      {name} <a href="javascript:" onclick={remove}>X</a>
    </li>
  </ul>
  <div if={!collection.length}>
    No facilities added!
  </div>
  <script>
    WidgetApp.controllers['facilities'].init(this);
  </script>
</facilities-page>
