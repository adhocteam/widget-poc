<plan-page>
  <h3>
    Plan ID: {opts.id}
  </h3>
  <coverage-set title="Doctors" collection={coverage.doctors} rollup={rolledUp.doctors}></coverage-set>
  <coverage-set title="Prescriptions" collection={coverage.scrips} rollup={rolledUp.scrips}></coverage-set>
  <coverage-set title="Facilities" collection={coverage.facilities} rollup={rolledUp.facilities}></coverage-set>
  <script>
    WidgetApp.controllers['plan-coverage'].init(this, opts.id)
  </script>
</plan-page>
