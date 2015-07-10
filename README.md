# Provider Search Widget

## Using

1. Add the js file

   ```
   <script type="text/javascript" src="build/snippet.js"></script>
   ```

2. Add a container for the coverage data for each plan on the page to be injected into:

   ```
   <div data-plan-id="<plan-id>" data-zip-code="<zip-code>"></div>
   ```

## Building

Install http-server globally with:

```
npm install http-server -g
```

Then:

```
npm install
gulp
http-server
open http://localhost:8080
```

#### Note:

The origin/target domain matching will not work when served via a file:/// URI scheme
