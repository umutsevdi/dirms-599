import { createPathComponent } from "@react-leaflet/core";
import L from "leaflet";
import "leaflet.markercluster";

interface MarkerClusterGroupProps {
  children?: React.ReactNode;
  iconCreateFunction?: (cluster: any) => L.DivIcon;
  spiderfyOnMaxZoom?: boolean;
  showCoverageOnHover?: boolean;
  maxClusterRadius?: number;
  disableClusteringAtZoom?: number;
  animate?: boolean;
  animateAddingMarkers?: boolean;
  singleMarkerMode?: boolean;
  chunkedLoading?: boolean;
  chunkProgress?: (processed: number, total: number, elapsed: number) => void;
  zoomToBoundsOnClick?: boolean;
  onClusterClick?: (e: any) => void;
  [key: string]: any;
}

const createMarkerClusterGroup = (
  props: MarkerClusterGroupProps,
  context: any
) => {
  const clusterProps: any = {
    spiderfyOnMaxZoom: props.spiderfyOnMaxZoom ?? true,
    showCoverageOnHover: props.showCoverageOnHover ?? false,
    maxClusterRadius: props.maxClusterRadius ?? 80,
    disableClusteringAtZoom: props.disableClusteringAtZoom ?? null,
    animate: props.animate ?? true,
    animateAddingMarkers: props.animateAddingMarkers ?? false,
    singleMarkerMode: props.singleMarkerMode ?? false,
    chunkedLoading: props.chunkedLoading ?? false,
    zoomToBoundsOnClick: props.zoomToBoundsOnClick ?? true,
  };

  if (props.iconCreateFunction) {
    clusterProps.iconCreateFunction = props.iconCreateFunction;
  }

  if (props.chunkProgress) {
    clusterProps.chunkProgress = props.chunkProgress;
  }

  // Add any other props
  Object.keys(props).forEach((key) => {
    if (
      ![
        "children",
        "iconCreateFunction",
        "spiderfyOnMaxZoom",
        "showCoverageOnHover",
        "maxClusterRadius",
        "disableClusteringAtZoom",
        "animate",
        "animateAddingMarkers",
        "singleMarkerMode",
        "chunkedLoading",
        "chunkProgress",
        "zoomToBoundsOnClick",
        "onClusterClick",
      ].includes(key)
    ) {
      clusterProps[key] = props[key];
    }
  });

  const instance = new (L as any).MarkerClusterGroup(clusterProps);

  // Handle events
  if (props.onClick) {
    instance.on("click", props.onClick);
  }
  if (props.onClusterClick) {
    instance.on("clusterclick", props.onClusterClick);
  }
  if (props.onSpiderfy) {
    instance.on("spiderfied", props.onSpiderfy);
  }
  if (props.onUnspiderfy) {
    instance.on("unspiderfied", props.onUnspiderfy);
  }

  return {
    instance,
    context: {
      ...context,
      layerContainer: instance,
    },
  };
};

const updateMarkerClusterGroup = (
  _instance: any,
  _props: MarkerClusterGroupProps,
  _prevProps: MarkerClusterGroupProps
) => {
  // Handle dynamic updates if needed
  // Currently, we recreate the cluster group when props change significantly
  // For simple cases, this is handled by React's reconciliation
  // No updates needed for now - component will remount on key changes
};

const MarkerClusterGroup = createPathComponent(
  createMarkerClusterGroup,
  updateMarkerClusterGroup
);

export default MarkerClusterGroup;
