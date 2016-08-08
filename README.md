Chet Lemon - chetjlemon@gmail.com
------------------------
React Flight search

File Structure:                       View Hierarchy:
```
+ app/                                -Dashboard    [controller]
  + bower_components                      -Query    [search bar and button]
  + environment/                          -Result   [display info]
    - apikeys.js
    - development.js                    
    - production.js
  + src/
    + components/
    + images/
    + less/
      - _variables.less
      - app.less
      - dash.less
      - query.less  
      - result.less
    + views/
    + utils/
    - Index.js
  - index.html
  - index.js
  - karma.conf.js
  - gulpfile.babel.js
```
how to run:

npm install
gulp watch
go to localhost:8080
