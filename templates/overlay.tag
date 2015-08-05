<plan-overlay>
  <div class="overlayContainer">
    <div class="overlayDetails">
      <ul>
        <overlay-line count="{opts.doctors}" section="doctors" label="Doctors"/>
        <overlay-line count="{opts.drugs}" section="scrips" label="Prescriptions"/>
        <overlay-line count="{opts.facilities}" section="facilities" label="Facilities"/>
      </ul>
      <a href="javascript:;" data-modal=true class="overlay all" data-section="list">View All / Edit</a>
    </div>
  </div>
</plan-overlay>
