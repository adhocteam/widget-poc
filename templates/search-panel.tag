<search-panel>
  <form onsubmit={search}>
    <label>
      Search
      <input name="query">
      <button>Search</button>
    </label>
  </form>
  <div class="results">
    <div class="doctors" if={results.doctors.length}>
      <h4>Doctors</h4>
      <ul>
        <li each={results.doctors}>
          {name} {specialty} <a href="javascript:" onclick={parent.addDoctor}>Add</a>
        </li>
      </ul>
    </div>

    <div class="drugs" if={results.drugs.length}>
      <h4>Drugs</h4>
      <ul>
        <li each={results.drugs}>
          {name} <a href="javascript:" onclick={parent.addDrug}>Add</a>
        </li>
      </ul>
    </div>
    <div class="facilities" if={results.facilities.length}>
      <h4>Facilities</h4>
      <ul>
        <li each={results.facilities}>
          {name} <a href="javascript:" onclick={parent.addFacility}>Add</a>
        </li>
      </ul>
    </div>
  </div>
  
  <script>
    WidgetApp.controllers['search'].init(this);
  </script>
</search-panel>
