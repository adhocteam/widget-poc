# Implementing the Provider Search Widget

1. Add a container for the coverage data for each plan on the page to be injected into:

   ```
   <div data-plan-id="<plan-id>" data-zip-code="<zip-code>"></div>
   ```

2. Include the javascript (url TBD):

   ```
   <script type="text/javascript" src="TBD.js"></script>
   ```

3. If the plans change after initial page load, post a window message:

    ```
    window.postMessage(JSON.stringify({dataChanged: true}), '*');
    ```
This is a pub-sub style notification so it's safe to call at any time.
