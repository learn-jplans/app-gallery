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
    

    <div id="nav">
      <div id="search-container">
        <select id="searchPlaceType">
          <option value="atm">ATM</option>
          <option value="hospital">hospital</option>
            
            <option value="bakery">Bakery</option>
            <option value="bank">Bank</option>
            <option value="bar">bar</option>
        </select>
        <button id="sort">Sort</button>
      </div>
      <div class="result-container">
        <table class="table">
          <tbody>
          </tbody>
        </table>
      </div>
    </div>

    <div id="map-canvas"></div>
    
    <!-- <div id="result-list">
      <ul class="clearfix" id="places">
        
      </ul>
    </div> -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js"></script>
    <script src="/assets/js/app.js"></script>
    <!-- template -->
    <script type="text/template" id="searchEntryTemplate">
    <tr data-id="<%= id %>" data-distance="<%= distance %>">
      <td class="place-name">
        <span class="label-name"><%= name %></span>
        <span class="label-address"><%= address %></span>
      </td>
      <td class="place-distance"><%= App.util.format(distance)+' km' %></td>
    </tr>
    </script>

  </body>
</html>