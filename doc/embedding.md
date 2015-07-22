# Implementing the Provider Search Widget

1. Add a container for the coverage data for each plan on the page to be injected into:

   ```
   <div data-plan-id="<plan-id>" data-zip-code="<zip-code>"></div>
   ```

2. Update `snippet.js`, line 4 to point to the location of async.js

3. Include the javascript:

   ```
   <script type="text/javascript" src="snippet.js"></script>
   ```

4. If the plans change after initial page load, post a window message:

    ```
    window.postMessage(JSON.stringify({dataChanged: true}), '*');
    ```
This is a pub-sub style notification so it's safe to call at any time.

## Notes

Provider/Drug search are wired up to the AdHoc Dev Marketplace API. Coverage is stubbed (Something is considered covered if its id has a common digit with the plan id)
