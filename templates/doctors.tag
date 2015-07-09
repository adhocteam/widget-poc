<doctors-page>
  <h3>Doctors</h3>
  <ul>
    <li each={collection}>
      {name} <a href="javascript:" onclick={remove}>X</a>
    </li>
  </ul>
  <script>
    this.collection = opts.collection.data
    remove(e){
      this.trigger('remove', e.item.id)
    }
  </script>
</doctors-page>
