import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Icon, DivIcon } from "leaflet";
import { useEffect } from "react";
import type { Coordinates, MapMarker, PeopleReport } from "../../types";
import { colors, sizing, shapes } from "../../theme";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from "./MarkerClusterGroup";

const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Create marker icon HTML with consistent styling
 */
const createMarkerHtml = (
  backgroundColor: string,
  content: string
): string => {
  return `<div style="background-color:${backgroundColor};color:white;border-radius:50%;width:${sizing.marker.width}px;height:${sizing.marker.height}px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:${sizing.marker.fontSize}px">${content}</div>`;
};

const disasterIcon = new DivIcon({
  html: createMarkerHtml(colors.disaster.main, "!"),
  className: "custom-disaster-icon",
  iconSize: [sizing.marker.width, sizing.marker.height],
  iconAnchor: [sizing.marker.width / 2, sizing.marker.height / 2],
});

const resourceIcon = new DivIcon({
  html: createMarkerHtml(colors.resource.main, "R"),
  className: "custom-resource-icon",
  iconSize: [sizing.marker.width, sizing.marker.height],
  iconAnchor: [sizing.marker.width / 2, sizing.marker.height / 2],
});

const createPeopleIcon = (count: number) =>
  new DivIcon({
    html: createMarkerHtml(colors.resource.main, count.toString()),
    className: "custom-people-icon",
    iconSize: [sizing.marker.width, sizing.marker.height],
    iconAnchor: [sizing.marker.width / 2, sizing.marker.height / 2],
  });

// Create cluster icon that sums all people counts in the cluster
const createPeopleClusterIcon = (cluster: any) => {
  const markers = cluster.getAllChildMarkers();
  let totalCount = 0;

  markers.forEach((marker: any) => {
    const report: PeopleReport | undefined = marker.options.peopleReport;
    if (report) {
      totalCount +=
        report.counts.baby +
        report.counts.child +
        report.counts.adult +
        report.counts.elderly;
    }
  });

  return new DivIcon({
    html: createMarkerHtml(colors.resource.main, totalCount.toString()),
    className: "custom-people-cluster-icon",
    iconSize: [sizing.marker.width, sizing.marker.height],
    iconAnchor: [sizing.marker.width / 2, sizing.marker.height / 2],
  });
};

// Map container styles using theme tokens
const mapContainerStyles = {
  height: "100%",
  width: "100%",
  borderRadius: shapes.borderRadius.md,
} as const;

interface DisasterMapProps {
  center?: Coordinates;
  zoom?: number;
  markers?: MapMarker[];
  circles?: { center: Coordinates; radius: number; color?: string }[];
  peopleReports?: PeopleReport[];
  onMapClick?: (coords: Coordinates) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  onClusterClick?: (reports: PeopleReport[]) => void;
  mapRef?: React.RefObject<{
    setView: (coords: Coordinates, zoom: number) => void;
  } | null>;
}

const MapClickHandler = ({
  onMapClick,
}: {
  onMapClick?: (coords: Coordinates) => void;
}) => {
  useMapEvents({
    click: (e) => {
      onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng, address: "" });
    },
  });
  return null;
};

const MapController = ({
  mapRef,
}: {
  mapRef?: React.RefObject<{
    setView: (coords: Coordinates, zoom: number) => void;
  } | null>;
}) => {
  const map = useMap();

  useEffect(() => {
    if (mapRef) {
      (
        mapRef as React.MutableRefObject<{
          setView: (coords: Coordinates, zoom: number) => void;
        } | null>
      ).current = {
        setView: (coords: Coordinates, zoom: number) => {
          map.setView([coords.lat, coords.lng], zoom);
        },
      };
    }
  }, [map, mapRef]);

  return null;
};

const DisasterMap = ({
  center = { lat: 39.9334, lng: 32.8597, address: "" },
  zoom = 6,
  markers = [],
  circles = [],
  peopleReports = [],
  onMapClick,
  onMarkerClick,
  onClusterClick,
  mapRef,
}: DisasterMapProps) => {
  const getMarkerIcon = (type: MapMarker["type"], report?: PeopleReport) => {
    switch (type) {
      case "disaster":
        return disasterIcon;
      case "resource":
        return resourceIcon;
      case "people":
        const count = report
          ? report.counts.baby +
            report.counts.child +
            report.counts.adult +
            report.counts.elderly
          : 0;
        return createPeopleIcon(count);
      default:
        return defaultIcon;
    }
  };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={mapContainerStyles}
    >
      <MapClickHandler onMapClick={onMapClick} />
      <MapController mapRef={mapRef} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* People reports - clustered */}
      <MarkerClusterGroup
        iconCreateFunction={createPeopleClusterIcon}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        maxClusterRadius={80}
        onClusterClick={(e: any) => {
          const markers = e.layer.getAllChildMarkers();
          const reports = markers
            .map(
              (marker: any) =>
                marker.options.peopleReport as PeopleReport | undefined
            )
            .filter(
              (report: PeopleReport | undefined): report is PeopleReport =>
                report !== undefined
            );
          if (reports.length > 0) {
            onClusterClick?.(reports);
          }
        }}
        zoomToBoundsOnClick={false}
      >
        {markers
          .filter((marker) => marker.type === "people")
          .map((marker) => {
            const report = peopleReports.find((r) => r.id === marker.id);
            const count = report
              ? report.counts.baby +
                report.counts.child +
                report.counts.adult +
                report.counts.elderly
              : 0;
            return (
              <Marker
                key={marker.id}
                position={[marker.position.lat, marker.position.lng]}
                icon={createPeopleIcon(count)}
                eventHandlers={{ click: () => onMarkerClick?.(marker) }}
                // Pass people report data for cluster calculation
                {...{ peopleReport: report }}
              >
                {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
              </Marker>
            );
          })}
      </MarkerClusterGroup>

      {/* Disaster and Resource markers - not clustered */}
      {markers
        .filter((marker) => marker.type !== "people")
        .map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            icon={getMarkerIcon(marker.type)}
            eventHandlers={{ click: () => onMarkerClick?.(marker) }}
          >
            {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
          </Marker>
        ))}
      {circles.map((circle, index) => (
        <Circle
          key={index}
          center={[circle.center.lat, circle.center.lng]}
          radius={circle.radius}
          pathOptions={{
            color: circle.color || colors.disaster.main,
            fillColor: circle.color || colors.disaster.main,
            fillOpacity: 0.15,
          }}
        />
      ))}
    </MapContainer>
  );
};

export default DisasterMap;
