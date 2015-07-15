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
    
    <link href="//cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/css/select2.min.css" rel="stylesheet" />
    
    <link rel="stylesheet" type="text/css" href="/assets/css/app.css">
  </head>
  <body>
    

    <div id="nav">
      <div id="search-container">
        <select id="searchPlaceType" class="select-category">
        </select>

        <button id="sort">Sort</button>
      </div>
      <div class="travel clearfix">
        <ul class="clearfix">
          <li id="walk" data-lat="0" data-lng="0"><i class="walk">W</i></li>
          <li id="drive" data-lat="0" data-lng="0"><i class="drive">D</i></li>
          <span class="loader"></span>
        </ul>
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
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/js/select2.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js"></script>
    <script src="/assets/js/app.min.js"></script>
    <script src="/assets/js/category.json"></script>
    <!-- template -->
    <script type="text/template" id="searchEntryTemplate">
    <tr data-id="<%= id %>" data-distance="<%= distance %>" data-lat="<%= position.lat() %>" data-lng="<%= position.lng() %>">
      <td class="place-name">
        <span class="label-name"><%= name %></span>
        <span class="label-address"><%= address %></span>
      </td>
      <td class="place-distance"><%= App.util.formatDistance(distance) %></td>
    </tr>
    </script>

  </body>
</html>