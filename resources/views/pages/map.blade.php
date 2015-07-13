<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <style>
      html, body, #map-canvas {
        height: 100%;
        margin: 0px;
        padding: 0px
      }
    </style>
    <title>Place search pagination</title>
    <!--<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&signed_in=true"></script>-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    
    <link rel="stylesheet" type="text/css" href="/assets/css/app.css">
  </head>
  <body>
    <div id="search-container">
      <select id="searchPlaceType">
        <option value="hospital">hospital</option>
          <option value="atm">ATM</option>
          <option value="bakery">Bakery</option>
          <option value="bank">Bank</option>
          <option value="bar">bar</option>
      </select>
    </div>
    <div id="map-canvas"></div>
    
    <div id="result-list">
      <ul class="clearfix" id="places">
        
      </ul>
    </div>
    
    <script src="/assets/js/app.js"></script>
  </body>
</html>