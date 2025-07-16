import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ZoomIn, ZoomOut, Filter, Plus, Minus, Grid, GitBranch, Network, ArrowRight } from "lucide-react";
import * as d3 from "d3";
import type { DataFieldConfig } from "@shared/schema";

interface DependencyGraphVisualizationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldConfigurations: DataFieldConfig[];
}

export default function DependencyGraphVisualization({ 
  open, 
  onOpenChange, 
  fieldConfigurations 
}: DependencyGraphVisualizationProps) {
  const [selectedLevel, setSelectedLevel] = useState<"all" | "event" | "bundle" | "source" | "field">("all");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [expandedBundles, setExpandedBundles] = useState<Set<string>>(new Set());
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"overview" | "focused">("overview");
  const [visualizationMode, setVisualizationMode] = useState<"sankey" | "hierarchical" | "force-directed" | "pipeline">("sankey");
  const [focusedBundle, setFocusedBundle] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [expandedFieldGroups, setExpandedFieldGroups] = useState<Set<string>>(new Set());
  const [fieldOverlay, setFieldOverlay] = useState<{visible: boolean, fields: any[], title: string, position: {x: number, y: number}} | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);
  
  // Constants for overflow management
  const MAX_VISIBLE_SOURCES = 3;
  const MAX_VISIBLE_FIELDS = 2;

  // Helper functions for interaction
  const toggleBundle = (bundleId: string) => {
    const newExpanded = new Set(expandedBundles);
    if (newExpanded.has(bundleId)) {
      newExpanded.delete(bundleId);
    } else {
      newExpanded.add(bundleId);
    }
    setExpandedBundles(newExpanded);
  };

  const focusOnBundle = (bundleId: string) => {
    setFocusedBundle(bundleId);
    setViewMode("focused");
  };

  const returnToOverview = () => {
    setViewMode("overview");
    setFocusedBundle(null);
    setSelectedNode(null);
  };

  const toggleSource = (sourceId: string) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(sourceId)) {
      newExpanded.delete(sourceId);
    } else {
      newExpanded.add(sourceId);
    }
    setExpandedSources(newExpanded);
  };

  const selectNode = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const toggleFieldGroup = (sourceId: string) => {
    const newExpanded = new Set(expandedFieldGroups);
    if (newExpanded.has(sourceId)) {
      newExpanded.delete(sourceId);
    } else {
      newExpanded.add(sourceId);
    }
    setExpandedFieldGroups(newExpanded);
  };

  const showFieldOverlay = (fields: any[], title: string, position: {x: number, y: number}) => {
    setFieldOverlay({
      visible: true,
      fields,
      title,
      position
    });
  };

  const hideFieldOverlay = () => {
    setFieldOverlay(null);
  };

  // Generate visualization data based on selected mode
  const generateVisualizationData = () => {
    switch (visualizationMode) {
      case "sankey":
        return generateSankeyLayout();
      case "hierarchical":
        return generateHierarchicalLayout();
      case "force-directed":
        return generateForceDirectedLayout();
      case "pipeline":
        return generatePipelineLayout();
      default:
        return generateSankeyLayout();
    }
  };

  // Generate Sankey diagram data with overflow handling and collapse/expand
  const generateSankeyLayout = () => {
    if (fieldConfigurations.length === 0) {
      return { nodes: [], links: [], levels: [] };
    }

    const nodes: any[] = [];
    const links: any[] = [];

    // Define column positions with better spacing for cleaner flows
    const levelConfig = {
      event: { x: 60, width: 120, color: "#3b82f6" },
      bundle: { x: 240, width: 110, color: "#10b981" },
      source: { x: 410, width: 110, color: "#f59e0b" },
      field: { x: 580, width: 140, color: "#8b5cf6" }
    };

    // Event node (single root) - centered vertically in the larger canvas
    const eventNode = {
      id: "event-1",
      type: "event",
      label: "Black Friday Sales Event",
      x: levelConfig.event.x,
      y: 270, // Centered in 600px height canvas
      width: levelConfig.event.width,
      height: 60,
      color: levelConfig.event.color
    };
    nodes.push(eventNode);

    // Group configurations by bundle
    const bundleGroups = fieldConfigurations.reduce((acc, config) => {
      if (!acc[config.bundleId]) {
        acc[config.bundleId] = [];
      }
      acc[config.bundleId].push(config);
      return acc;
    }, {} as Record<string, DataFieldConfig[]>);

    // Filter bundles based on view mode
    const visibleBundles = viewMode === "focused" && focusedBundle
      ? { [focusedBundle]: bundleGroups[focusedBundle] }
      : bundleGroups;

    // Calculate vertical positions for bundles with better spacing
    const bundleIds = Object.keys(visibleBundles).sort(); // Sort for consistent layout
    const totalBundles = bundleIds.length;
    const bundleHeight = 45;
    const bundleSpacing = 100; // Increased spacing to reduce tangling
    const totalBundleArea = (totalBundles * bundleHeight) + ((totalBundles - 1) * bundleSpacing);
    const bundleStartY = Math.max(80, (600 - totalBundleArea) / 2); // Ensure minimum top margin with larger canvas

    bundleIds.forEach((bundleId, bundleIndex) => {
      const bundleY = bundleStartY + (bundleIndex * (bundleHeight + bundleSpacing));
      const bundleConfigs = visibleBundles[bundleId];
      const isExpanded = expandedBundles.has(bundleId) || viewMode === "focused";
      
      const bundleNode = {
        id: `bundle-${bundleId}`,
        type: "bundle",
        label: bundleId.charAt(0).toUpperCase() + bundleId.slice(1) + ` (${bundleConfigs.length})`,
        x: levelConfig.bundle.x,
        y: bundleY,
        width: levelConfig.bundle.width,
        height: bundleHeight,
        color: levelConfig.bundle.color,
        count: bundleConfigs.length
      };
      nodes.push(bundleNode);

      // Link from event to bundle
      links.push({
        source: eventNode.id,
        target: bundleNode.id,
        value: bundleConfigs.length,
        sourceX: eventNode.x + eventNode.width,
        sourceY: eventNode.y + eventNode.height / 2,
        targetX: bundleNode.x,
        targetY: bundleY + bundleHeight / 2
      });

      // Group by data source within bundle
      const sourceGroups = bundleConfigs.reduce((acc, config) => {
        if (!acc[config.dataSource]) {
          acc[config.dataSource] = [];
        }
        acc[config.dataSource].push(config);
        return acc;
      }, {} as Record<string, DataFieldConfig[]>);

      const allSourceIds = Object.keys(sourceGroups).sort(); // Sort for consistent layout
      
      // Handle overflow: show only first few sources unless expanded
      const visibleSourceIds = isExpanded ? allSourceIds : allSourceIds.slice(0, MAX_VISIBLE_SOURCES);
      const hasMoreSources = !isExpanded && allSourceIds.length > MAX_VISIBLE_SOURCES;
      
      const sourceHeight = 32;
      const sourceSpacing = 55; // Increased spacing for better separation
      const totalVisibleSources = visibleSourceIds.length + (hasMoreSources ? 1 : 0); // +1 for overflow indicator
      const totalSourceArea = (totalVisibleSources * sourceHeight) + ((totalVisibleSources - 1) * sourceSpacing);
      const sourceStartY = bundleY + (bundleHeight / 2) - (totalSourceArea / 2);

      visibleSourceIds.forEach((sourceName, sourceIndex) => {
        const sourceY = sourceStartY + (sourceIndex * (sourceHeight + sourceSpacing));
        const sourceConfigs = sourceGroups[sourceName];
        
        const sourceNode = {
          id: `source-${bundleId}-${sourceName}`,
          type: "source",
          label: `${sourceName} (${sourceConfigs.length})`,
          x: levelConfig.source.x,
          y: sourceY,
          width: levelConfig.source.width,
          height: sourceHeight,
          color: levelConfig.source.color,
          count: sourceConfigs.length
        };
        nodes.push(sourceNode);

        // Link from bundle to source
        links.push({
          source: bundleNode.id,
          target: sourceNode.id,
          value: sourceConfigs.length,
          sourceX: bundleNode.x + bundleNode.width,
          sourceY: bundleY + bundleHeight / 2,
          targetX: sourceNode.x,
          targetY: sourceY + sourceHeight / 2
        });

        // Field nodes - create a single expandable field group or individual fields
        const sourceKey = `${bundleId}-${sourceName}`;
        const isFieldGroupExpanded = expandedFieldGroups.has(sourceKey);
        
        if (isFieldGroupExpanded) {
          // Show expanded field list in a rounded rectangle
          const fieldListHeight = Math.max(120, sourceConfigs.length * 25 + 40);
          const fieldListY = sourceY + sourceHeight + 20;
          
          const fieldGroupNode = {
            id: `field-group-${sourceKey}`,
            type: "field-group",
            label: `${sourceName} Fields`,
            x: levelConfig.field.x,
            y: fieldListY,
            width: levelConfig.field.width + 20,
            height: fieldListHeight,
            color: levelConfig.field.color,
            fields: sourceConfigs,
            sourceId: sourceNode.id,
            expanded: true
          };
          nodes.push(fieldGroupNode);

          // Single link from source to field group
          links.push({
            source: sourceNode.id,
            target: fieldGroupNode.id,
            value: sourceConfigs.length,
            sourceX: sourceNode.x + sourceNode.width,
            sourceY: sourceY + sourceHeight / 2,
            targetX: fieldGroupNode.x,
            targetY: fieldListY + 20
          });
        } else {
          // Show collapsed field representation
          const fieldHeight = 32;
          const fieldY = sourceY + sourceHeight + 20;
          
          const fieldSummaryNode = {
            id: `field-summary-${sourceKey}`,
            type: "field-summary",
            label: `${sourceConfigs.length} Fields`,
            x: levelConfig.field.x,
            y: fieldY,
            width: levelConfig.field.width,
            height: fieldHeight,
            color: levelConfig.field.color,
            fieldCount: sourceConfigs.length,
            sourceId: sourceNode.id,
            sourceKey: sourceKey,
            expanded: false
          };
          nodes.push(fieldSummaryNode);

          // Link from source to field summary
          links.push({
            source: sourceNode.id,
            target: fieldSummaryNode.id,
            value: sourceConfigs.length,
            sourceX: sourceNode.x + sourceNode.width,
            sourceY: sourceY + sourceHeight / 2,
            targetX: fieldSummaryNode.x,
            targetY: fieldY + fieldHeight / 2
          });
        }
      });

      // Add overflow indicator if there are more sources
      if (hasMoreSources) {
        const overflowY = sourceStartY + (visibleSourceIds.length * (sourceHeight + sourceSpacing));
        const remainingCount = allSourceIds.length - visibleSourceIds.length;
        
        const overflowNode = {
          id: `overflow-${bundleId}`,
          type: "overflow",
          label: `+${remainingCount} more`,
          x: levelConfig.source.x,
          y: overflowY,
          width: levelConfig.source.width,
          height: sourceHeight,
          color: "#9ca3af",
          bundleId: bundleId,
          action: "expand"
        };
        nodes.push(overflowNode);

        // Link from bundle to overflow indicator
        links.push({
          source: bundleNode.id,
          target: overflowNode.id,
          value: remainingCount,
          sourceX: bundleNode.x + bundleNode.width,
          sourceY: bundleY + bundleHeight / 2,
          targetX: overflowNode.x,
          targetY: overflowY + sourceHeight / 2
        });
      }
    });

    return { 
      nodes, 
      links,
      levels: [
        { name: "Event", x: levelConfig.event.x, color: levelConfig.event.color },
        { name: "Bundle", x: levelConfig.bundle.x, color: levelConfig.bundle.color },
        { name: "Source", x: levelConfig.source.x, color: levelConfig.source.color },
        { name: "Field", x: levelConfig.field.x, color: levelConfig.field.color }
      ]
    };
  };

  // Generate enhanced hierarchical tree layout with D3 tree algorithm
  const generateHierarchicalLayout = () => {
    if (fieldConfigurations.length === 0) {
      return { nodes: [], links: [], levels: [] };
    }

    const nodes: any[] = [];
    const links: any[] = [];

    // Create hierarchical data structure
    const bundleGroups = fieldConfigurations.reduce((acc, config) => {
      if (!acc[config.bundleId]) {
        acc[config.bundleId] = [];
      }
      acc[config.bundleId].push(config);
      return acc;
    }, {} as Record<string, DataFieldConfig[]>);

    // Build tree structure for D3
    const treeData = {
      id: "event-1",
      type: "event",
      label: "Black Friday Sales Event",
      children: Object.keys(bundleGroups).map((bundleId) => ({
        id: `bundle-${bundleId}`,
        type: "bundle",
        label: bundleId.charAt(0).toUpperCase() + bundleId.slice(1),
        expanded: expandedBundles.has(bundleId),
        children: expandedBundles.has(bundleId) ? 
          Object.keys(bundleGroups[bundleId].reduce((acc, config) => {
            if (!acc[config.dataSource]) {
              acc[config.dataSource] = [];
            }
            acc[config.dataSource].push(config);
            return acc;
          }, {} as Record<string, DataFieldConfig[]>)).map((sourceName) => {
            const sourceKey = `${bundleId}-${sourceName}`;
            const sourceConfigs = bundleGroups[bundleId].filter(c => c.dataSource === sourceName);
            return {
              id: `source-${sourceKey}`,
              type: "source",
              label: sourceName,
              expanded: expandedSources.has(sourceKey),
              sourceKey: sourceKey,
              children: expandedSources.has(sourceKey) ? 
                sourceConfigs.map((config) => ({
                  id: `field-${config.id}`,
                  type: "field",
                  label: config.fieldName,
                  config: config
                })) : [{
                  id: `field-summary-${sourceKey}`,
                  type: "field-summary",
                  label: `${sourceConfigs.length} Fields`,
                  fieldCount: sourceConfigs.length,
                  sourceKey: sourceKey
                }]
            };
          }) : []
      }))
    };

    // Use D3 tree layout for optimal positioning
    const treeLayout = d3.tree<any>()
      .size([850, 450])
      .separation((a, b) => {
        // Increase separation for better readability
        const baseSeparation = a.parent === b.parent ? 1 : 2;
        const typeFactor = a.data.type === "field" ? 0.7 : 1.2;
        return baseSeparation * typeFactor;
      });

    const root = d3.hierarchy(treeData);
    const treeNodes = treeLayout(root);

    // Convert D3 tree nodes to our format with proper positioning
    treeNodes.descendants().forEach((node) => {
      const nodeWidth = node.data.type === "event" ? 160 : 
                      node.data.type === "bundle" ? 120 : 
                      node.data.type === "source" ? 100 : 80;
      const nodeHeight = node.data.type === "event" ? 50 : 
                       node.data.type === "bundle" ? 40 : 
                       node.data.type === "source" ? 30 : 25;

      const nodeData = {
        id: node.data.id,
        type: node.data.type,
        label: node.data.label,
        x: node.x - nodeWidth / 2 + 50, // Center nodes and add padding
        y: node.y + 70, // Add top padding
        width: nodeWidth,
        height: nodeHeight,
        color: node.data.type === "event" ? "#3b82f6" :
               node.data.type === "bundle" ? "#10b981" :
               node.data.type === "source" ? "#f59e0b" : "#8b5cf6",
        level: node.depth,
        expanded: node.data.expanded,
        fieldCount: node.data.fieldCount,
        sourceKey: node.data.sourceKey,
        config: node.data.config
      };
      nodes.push(nodeData);
    });

    // Create elegant curved links between parent and child nodes
    treeNodes.links().forEach((link) => {
      const sourceNode = nodes.find(n => n.id === link.source.data.id);
      const targetNode = nodes.find(n => n.id === link.target.data.id);
      
      if (sourceNode && targetNode) {
        const sourceX = sourceNode.x + sourceNode.width / 2;
        const sourceY = sourceNode.y + sourceNode.height;
        const targetX = targetNode.x + targetNode.width / 2;
        const targetY = targetNode.y;

        // Create curved path for better visual flow
        const midY = sourceY + (targetY - sourceY) / 2;
        const path = `M ${sourceX},${sourceY} C ${sourceX},${midY} ${targetX},${midY} ${targetX},${targetY}`;

        links.push({
          source: sourceNode.id,
          target: targetNode.id,
          sourceX: sourceX,
          sourceY: sourceY,
          targetX: targetX,
          targetY: targetY,
          path: path,
          value: 1
        });
      }
    });

    return { nodes, links, levels: [] };
  };

  // Generate D3-powered force-directed layout
  const generateForceDirectedLayout = () => {
    if (fieldConfigurations.length === 0) {
      return { nodes: [], links: [], levels: [] };
    }

    const nodes: any[] = [];
    const links: any[] = [];

    // Create hierarchical data structure for D3
    const bundleGroups = fieldConfigurations.reduce((acc, config) => {
      if (!acc[config.bundleId]) {
        acc[config.bundleId] = [];
      }
      acc[config.bundleId].push(config);
      return acc;
    }, {} as Record<string, DataFieldConfig[]>);

    // Event node (root)
    const eventNode = {
      id: "event-1",
      type: "event",
      label: "Black Friday Sales Event",
      width: 160,
      height: 50,
      color: "#3b82f6",
      fx: null, // Allow free movement
      fy: null,
      radius: 25
    };
    nodes.push(eventNode);

    // Bundle nodes
    Object.keys(bundleGroups).forEach((bundleId) => {
      const bundleConfigs = bundleGroups[bundleId];
      const bundleNode = {
        id: `bundle-${bundleId}`,
        type: "bundle",
        label: bundleId.charAt(0).toUpperCase() + bundleId.slice(1),
        width: 120,
        height: 40,
        color: "#10b981",
        expanded: expandedBundles.has(bundleId),
        radius: 20,
        group: 1
      };
      nodes.push(bundleNode);

      // Link event to bundle
      links.push({
        source: eventNode.id,
        target: bundleNode.id,
        value: bundleConfigs.length,
        strength: 0.8
      });

      // Source nodes for expanded bundles
      if (expandedBundles.has(bundleId)) {
        const sourceGroups = bundleConfigs.reduce((acc, config) => {
          if (!acc[config.dataSource]) {
            acc[config.dataSource] = [];
          }
          acc[config.dataSource].push(config);
          return acc;
        }, {} as Record<string, DataFieldConfig[]>);

        Object.keys(sourceGroups).forEach((sourceName) => {
          const sourceConfigs = sourceGroups[sourceName];
          const sourceKey = `${bundleId}-${sourceName}`;
          
          const sourceNode = {
            id: `source-${sourceKey}`,
            type: "source",
            label: sourceName,
            width: 100,
            height: 30,
            color: "#f59e0b",
            expanded: expandedSources.has(sourceKey),
            radius: 15,
            group: 2
          };
          nodes.push(sourceNode);

          // Link bundle to source
          links.push({
            source: bundleNode.id,
            target: sourceNode.id,
            value: sourceConfigs.length,
            strength: 0.6
          });

          // Field nodes for expanded sources
          if (expandedSources.has(sourceKey)) {
            sourceConfigs.forEach((config) => {
              const fieldNode = {
                id: `field-${config.id}`,
                type: "field",
                label: config.fieldName,
                width: 80,
                height: 25,
                color: "#8b5cf6",
                radius: 10,
                group: 3,
                config: config
              };
              nodes.push(fieldNode);

              // Link source to field
              links.push({
                source: sourceNode.id,
                target: fieldNode.id,
                value: 1,
                strength: 0.4
              });
            });
          } else {
            // Field summary node
            const fieldSummaryNode = {
              id: `field-summary-${sourceKey}`,
              type: "field-summary",
              label: `${sourceConfigs.length} Fields`,
              width: 90,
              height: 25,
              color: "#8b5cf6",
              fieldCount: sourceConfigs.length,
              sourceKey: sourceKey,
              radius: 12,
              group: 3
            };
            nodes.push(fieldSummaryNode);

            // Link source to field summary
            links.push({
              source: sourceNode.id,
              target: fieldSummaryNode.id,
              value: sourceConfigs.length,
              strength: 0.4
            });
          }
        });
      }
    });

    return { nodes, links, levels: [] };
  };

  // Generate pipeline layout
  const generatePipelineLayout = () => {
    if (fieldConfigurations.length === 0) {
      return { nodes: [], links: [], levels: [] };
    }

    const nodes: any[] = [];
    const links: any[] = [];

    // Pipeline stages
    const stageWidth = 150;
    const stageHeight = 80;
    const stageSpacing = 200;
    const startX = 80;

    // Stage 1: Event Planning
    const planningStage = {
      id: "stage-planning",
      type: "stage",
      label: "Event Planning",
      x: startX,
      y: 200,
      width: stageWidth,
      height: stageHeight,
      color: "#3b82f6"
    };
    nodes.push(planningStage);

    // Stage 2: Data Collection
    const collectionStage = {
      id: "stage-collection",
      type: "stage",
      label: "Data Collection",
      x: startX + stageSpacing,
      y: 200,
      width: stageWidth,
      height: stageHeight,
      color: "#10b981"
    };
    nodes.push(collectionStage);

    // Stage 3: Processing
    const processingStage = {
      id: "stage-processing",
      type: "stage",
      label: "Data Processing",
      x: startX + stageSpacing * 2,
      y: 200,
      width: stageWidth,
      height: stageHeight,
      color: "#f59e0b"
    };
    nodes.push(processingStage);

    // Stage 4: Analysis
    const analysisStage = {
      id: "stage-analysis",
      type: "stage",
      label: "Analysis & Insights",
      x: startX + stageSpacing * 3,
      y: 200,
      width: stageWidth,
      height: stageHeight,
      color: "#8b5cf6"
    };
    nodes.push(analysisStage);

    // Connect stages with arrows
    for (let i = 0; i < 3; i++) {
      links.push({
        source: `stage-${["planning", "collection", "processing"][i]}`,
        target: `stage-${["collection", "processing", "analysis"][i]}`,
        value: 5,
        sourceX: startX + stageSpacing * i + stageWidth,
        sourceY: 240,
        targetX: startX + stageSpacing * (i + 1),
        targetY: 240
      });
    }

    return { nodes, links, levels: [] };
  };

  const { nodes, links, levels } = generateVisualizationData();

  // Clear D3 elements when switching visualization modes
  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll(".d3-link").remove();
      svg.selectAll(".d3-node").remove();
    }
  }, [visualizationMode]);

  // D3 Force Simulation Effect
  useEffect(() => {
    if (visualizationMode !== "force-directed" || !svgRef.current || nodes.length === 0) {
      // Clean up D3 elements when not in force-directed mode
      if (svgRef.current) {
        const svg = d3.select(svgRef.current);
        svg.selectAll(".d3-link").remove();
        svg.selectAll(".d3-node").remove();
      }
      return;
    }

    const svg = d3.select(svgRef.current);
    const width = 950;
    const height = 600;

    // Clear previous simulation and D3 elements
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
    
    // Remove all D3-created elements before creating new ones
    svg.selectAll(".d3-link").remove();
    svg.selectAll(".d3-node").remove();

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .distance((d: any) => {
          // Shorter distances for stronger connections
          const distance = d.value > 3 ? 80 : 120;
          return distance;
        })
        .strength((d: any) => d.strength || 0.3)
      )
      .force("charge", d3.forceManyBody()
        .strength((d: any) => {
          // Stronger repulsion for larger nodes
          const strength = d.type === "event" ? -800 : -300;
          return strength;
        })
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide()
        .radius((d: any) => (d.radius || 15) + 5)
      )
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    simulationRef.current = simulation;

    // Create links
    const linkElements = svg.selectAll(".d3-link")
      .data(links)
      .join("line")
      .attr("class", "d3-link")
      .attr("stroke", "#6b7280")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 2)
      .style("pointer-events", "none");

    // Create nodes
    const nodeElements = svg.selectAll(".d3-node")
      .data(nodes)
      .join("g")
      .attr("class", "d3-node")
      .style("cursor", "pointer")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Add node rectangles
    nodeElements.selectAll("rect").remove();
    nodeElements.append("rect")
      .attr("width", (d: any) => d.width)
      .attr("height", (d: any) => d.height)
      .attr("x", (d: any) => -d.width / 2)
      .attr("y", (d: any) => -d.height / 2)
      .attr("fill", (d: any) => selectedNode === d.id ? "#fbbf24" : d.color)
      .attr("stroke", (d: any) => selectedNode === d.id ? "#f59e0b" : "transparent")
      .attr("stroke-width", (d: any) => selectedNode === d.id ? 2 : 0)
      .attr("rx", 6)
      .on("click", (event, d: any) => {
        event.stopPropagation();
        handleNodeClick(d);
      });

    // Add node labels
    nodeElements.selectAll("text").remove();
    nodeElements.append("text")
      .text((d: any) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "11px")
      .attr("fill", "white")
      .attr("font-weight", "500")
      .style("pointer-events", "none");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeElements
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [visualizationMode, nodes, links, selectedNode, expandedBundles, expandedSources]);

  // Handle node clicks for D3 nodes
  const handleNodeClick = (node: any) => {
    if (node.type === "bundle") {
      toggleBundle(node.id.replace('bundle-', ''));
    } else if (node.type === "source") {
      toggleSource(node.id.replace('source-', ''));
    } else if (node.type === "field-summary") {
      const sourceConfigs = fieldConfigurations.filter(config => 
        `${config.bundleId}-${config.dataSource}` === node.sourceKey
      );
      showFieldOverlay(sourceConfigs, `${node.sourceKey.split('-')[1]} Fields`, {
        x: node.x || 0,
        y: node.y || 0
      });
    } else {
      selectNode(node.id);
    }
  };

  const exportGraph = () => {
    const svg = document.querySelector('#sankey-svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "dependency-graph.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  // Helper function to determine if a node is relevant to the selected node
  const isNodeRelevantToSelection = (node: any, selectedNodeId: string, links: any[]) => {
    if (node.id === selectedNodeId) return true;
    
    // Find all nodes that are connected to the selected node
    const connectedNodes = new Set();
    connectedNodes.add(selectedNodeId);
    
    // Add all nodes that have direct connections to/from selected node
    links.forEach(link => {
      if (link.source === selectedNodeId) {
        connectedNodes.add(link.target);
      }
      if (link.target === selectedNodeId) {
        connectedNodes.add(link.source);
      }
    });
    
    return connectedNodes.has(node.id);
  };

  const filteredNodes = nodes.filter((node: any) => {
    // If a node is selected, show only that node and its dependencies
    if (selectedNode) {
      return isNodeRelevantToSelection(node, selectedNode, links);
    }
    
    // Otherwise use level filtering
    if (selectedLevel === "all") return true;
    if (selectedLevel === "event") return node.type === "event";
    if (selectedLevel === "bundle") return node.type === "event" || node.type === "bundle";
    if (selectedLevel === "source") return node.type !== "field";
    return true;
  });

  const filteredLinks = links.filter((link: any) => {
    if (selectedLevel === "all") return true;
    if (selectedLevel === "event") return link.source === "event-1";
    if (selectedLevel === "bundle") return !link.target.startsWith("field-");
    if (selectedLevel === "source") return !link.target.startsWith("field-");
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span>Signal Dependencies - Sankey Diagram</span>
              {viewMode === "focused" && focusedBundle && (
                <Badge variant="secondary" className="text-xs">
                  Focused: {focusedBundle}
                </Badge>
              )}
              {selectedNode && (
                <Badge variant="outline" className="text-xs">
                  Selected: {selectedNode.replace(/^(event|bundle|source|field)-/, '')}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">
                {visualizationMode} View
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {viewMode === "focused" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={returnToOverview}
                  className="text-xs"
                >
                  ← Back to Overview
                </Button>
              )}
              {selectedNode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                  className="text-xs"
                >
                  Clear Selection
                </Button>
              )}
              
              {/* Visualization Mode Selector */}
              <div className="flex items-center space-x-1 border border-gray-600 rounded-md p-1">
                <Button
                  variant={visualizationMode === "sankey" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setVisualizationMode("sankey")}
                  className="h-7 w-7 p-0"
                  title="Sankey Flow"
                >
                  <GitBranch className="h-3 w-3" />
                </Button>
                <Button
                  variant={visualizationMode === "hierarchical" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setVisualizationMode("hierarchical")}
                  className="h-7 w-7 p-0"
                  title="Hierarchical Tree"
                >
                  <Grid className="h-3 w-3" />
                </Button>
                <Button
                  variant={visualizationMode === "force-directed" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setVisualizationMode("force-directed")}
                  className="h-7 w-7 p-0"
                  title="Force-Directed Network"
                >
                  <Network className="h-3 w-3" />
                </Button>
                <Button
                  variant={visualizationMode === "pipeline" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setVisualizationMode("pipeline")}
                  className="h-7 w-7 p-0"
                  title="Pipeline Stages"
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportGraph}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <Select value={selectedLevel} onValueChange={(value: any) => setSelectedLevel(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="event">Event Only</SelectItem>
                <SelectItem value="bundle">Up to Bundle</SelectItem>
                <SelectItem value="source">Up to Source</SelectItem>
                <SelectItem value="field">All Fields</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Level indicators */}
          <div className="w-48 mr-4 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Hierarchy Levels</h3>
                <div className="space-y-3">
                  {levels.map((level, index) => (
                    <div key={level.name} className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: level.color }}
                      ></div>
                      <div>
                        <div className="font-medium text-sm">{level.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {nodes.filter((n: any) => n.type === level.name.toLowerCase()).length} items
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-3 border-t">
                  <h4 className="font-medium mb-2 text-sm">Statistics</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Total Nodes: {nodes.length}</div>
                    <div>Total Links: {links.length}</div>
                    <div>Showing: {filteredNodes.length} nodes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sankey diagram */}
          <div className="flex-1 overflow-auto border rounded-lg bg-muted/20">
            {fieldConfigurations.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center text-muted-foreground">
                  <div className="text-lg font-medium mb-2">No Data Configured</div>
                  <div className="text-sm">Configure data signals to see the dependency graph</div>
                </div>
              </div>
            ) : (
              <div className="min-w-[1000px] min-h-[600px] p-4">
                <svg
                  ref={svgRef}
                  id="sankey-svg"
                  width="950"
                  height="600"
                  viewBox="0 0 950 600"
                  style={{ transform: visualizationMode === "force-directed" ? 'scale(1)' : `scale(${zoomLevel})`, transformOrigin: '0 0' }}
                  className="bg-background rounded"
                >
                  {visualizationMode !== "force-directed" && (
                    <React.Fragment>
                      {/* Enhanced flow connections with mode-specific rendering */}
                      {filteredLinks.map((link: any) => {
                    // Use tree-optimized curves for hierarchical mode
                    if (visualizationMode === "hierarchical" && link.path) {
                      return (
                        <path
                          key={`${link.source}-${link.target}`}
                          d={link.path}
                          fill="none"
                          stroke="#64748b"
                          strokeWidth="2"
                          opacity="0.7"
                          className="hover:opacity-1 hover:stroke-blue-500 transition-all duration-200"
                          style={{
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                          }}
                        />
                      );
                    }
                    
                    // Use sophisticated curves for other modes
                    const dx = link.targetX - link.sourceX;
                    const dy = link.targetY - link.sourceY;
                    
                    // Control points for smoother, less tangled curves
                    const cp1x = link.sourceX + dx * 0.6;
                    const cp1y = link.sourceY + dy * 0.1;
                    const cp2x = link.sourceX + dx * 0.8;
                    const cp2y = link.targetY - dy * 0.1;
                    
                    const path = `M ${link.sourceX},${link.sourceY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${link.targetX},${link.targetY}`;
                    
                    // Calculate stroke width based on link value and importance
                    const strokeWidth = Math.max(2, Math.min(8, link.value * 1.5));
                    
                    return (
                      <path
                        key={`${link.source}-${link.target}`}
                        d={path}
                        fill="none"
                        stroke="#64748b"
                        strokeWidth={strokeWidth}
                        opacity="0.6"
                        className="hover:opacity-0.9 hover:stroke-blue-400 transition-all duration-200"
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                        }}
                      />
                    );
                  })}

                  {/* Nodes */}
                  {filteredNodes.map((node: any) => (
                    <g key={node.id}>
                      <rect
                        x={node.x}
                        y={node.y}
                        width={node.width}
                        height={node.height}
                        fill={selectedNode === node.id ? "#fbbf24" : node.color}
                        stroke={selectedNode === node.id ? "#f59e0b" : "transparent"}
                        strokeWidth={selectedNode === node.id ? "2" : "0"}
                        rx={node.type === "field-group" ? "12" : "4"}
                        className="cursor-pointer hover:opacity-80 transition-all duration-200"
                        onClick={() => {
                          if (node.type === "overflow") {
                            toggleBundle(node.bundleId);
                          } else if (node.type === "bundle") {
                            if (visualizationMode === "sankey") {
                              focusOnBundle(node.id.replace('bundle-', ''));
                            } else {
                              toggleBundle(node.id.replace('bundle-', ''));
                            }
                          } else if (node.type === "source") {
                            const sourceKey = node.sourceKey || node.id.replace("source-", "");
                            toggleSource(sourceKey);
                          } else if (node.type === "field-summary") {
                            // Show overlay instead of inline expansion
                            const sourceConfigs = fieldConfigurations.filter(config => 
                              `${config.bundleId}-${config.dataSource}` === node.sourceKey
                            );
                            showFieldOverlay(sourceConfigs, `${node.sourceKey.split('-')[1]} Fields`, {
                              x: node.x + node.width / 2,
                              y: node.y + node.height / 2
                            });
                          } else if (node.type === "field-group") {
                            hideFieldOverlay();
                          } else if (node.type === "field") {
                            // For field nodes, show the data source fields modal
                            if (node.config) {
                              const sourceKey = `${node.config.bundleId}-${node.config.dataSource}`;
                              const sourceConfigs = fieldConfigurations.filter(config => 
                                `${config.bundleId}-${config.dataSource}` === sourceKey
                              );
                              showFieldOverlay(sourceConfigs, `${node.config.dataSource} Fields`, {
                                x: node.x + node.width / 2,
                                y: node.y + node.height / 2
                              });
                            }
                          }
                          // Prevent any default behavior that might reset states
                        }}
                      />
                      
                      {/* Field list inside expanded field groups */}
                      {node.type === "field-group" && node.fields && node.fields.map((field: any, index: number) => (
                        <g key={`field-item-${field.id}`}>
                          <rect
                            x={node.x + 10}
                            y={node.y + 30 + (index * 24)}
                            width={node.width - 20}
                            height={20}
                            fill="#ffffff"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            rx="4"
                            className="hover:fill-gray-50"
                          />
                          <text
                            x={node.x + 15}
                            y={node.y + 42 + (index * 24)}
                            fontSize="10"
                            fill="#374151"
                            className="pointer-events-none"
                          >
                            {field.fieldName.length > 18 ? field.fieldName.substring(0, 15) + "..." : field.fieldName}
                          </text>
                          <text
                            x={node.x + node.width - 15}
                            y={node.y + 42 + (index * 24)}
                            fontSize="8"
                            fill="#6b7280"
                            textAnchor="end"
                            className="pointer-events-none"
                          >
                            {field.updateFrequency}
                          </text>
                        </g>
                      ))}
                      
                      {/* Special handling for overflow nodes */}
                      {node.type === "overflow" && (
                        <g>
                          <circle
                            cx={node.x + 20}
                            cy={node.y + node.height / 2}
                            r="8"
                            fill="#ffffff"
                            stroke={node.color}
                            strokeWidth="2"
                            className="cursor-pointer"
                            onClick={() => toggleBundle(node.bundleId)}
                          />
                          <text
                            x={node.x + 20}
                            y={node.y + node.height / 2 + 3}
                            fontSize="12"
                            fill={node.color}
                            textAnchor="middle"
                            className="cursor-pointer font-bold"
                          >
                            +
                          </text>
                        </g>
                      )}

                      {/* Enhanced expandable indicators for tree visualization */}
                      {(node.type === "bundle" || node.type === "source") && visualizationMode === "hierarchical" && (
                        <g
                          onClick={() => {
                            if (node.type === "bundle") {
                              toggleBundle(node.id.replace("bundle-", ""));
                            } else if (node.type === "source") {
                              toggleSource(node.sourceKey || node.id.replace("source-", ""));
                            }
                          }}
                        >
                          <circle
                            cx={node.x + node.width - 15}
                            cy={node.y + 15}
                            r="8"
                            fill="#ffffff"
                            stroke={node.expanded ? "#10b981" : "#6b7280"}
                            strokeWidth="2"
                            className="cursor-pointer hover:stroke-blue-500 transition-colors duration-200"
                          />
                          <text
                            x={node.x + node.width - 15}
                            y={node.y + 19}
                            fontSize="10"
                            fill={node.expanded ? "#10b981" : "#6b7280"}
                            textAnchor="middle"
                            className="cursor-pointer font-bold"
                          >
                            {node.expanded ? "−" : "+"}
                          </text>
                        </g>
                      )}
                      
                      {/* Standard expandable indicators for other modes */}
                      {(node.type === "bundle" || node.type === "source") && visualizationMode !== "sankey" && visualizationMode !== "hierarchical" && (
                        <g>
                          <circle
                            cx={node.x + node.width - 12}
                            cy={node.y + 12}
                            r="6"
                            fill="#ffffff"
                            stroke="#6b7280"
                            strokeWidth="1"
                            className="cursor-pointer"
                          />
                          <text
                            x={node.x + node.width - 12}
                            y={node.y + 15}
                            fontSize="8"
                            fill="#6b7280"
                            textAnchor="middle"
                            className="cursor-pointer font-bold"
                          >
                            {node.expanded ? "−" : "+"}
                          </text>
                        </g>
                      )}
                      
                      <text
                        x={node.x + node.width / 2}
                        y={node.y + node.height / 2 + 4}
                        textAnchor="middle"
                        className="text-xs fill-white font-medium pointer-events-none"
                        style={{ fontSize: '11px' }}
                      >
                        {node.label}
                      </text>
                      {/* Additional info for fields */}
                      {node.type === "field" && node.frequency && (
                        <text
                          x={node.x + node.width / 2}
                          y={node.y + node.height + 12}
                          textAnchor="middle"
                          className="text-xs fill-muted-foreground pointer-events-none"
                          style={{ fontSize: '9px' }}
                        >
                          {node.frequency} | {node.retention}
                        </text>
                      )}
                    </g>
                  ))}
                    </React.Fragment>
                  )}
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Field Overlay */}
        {fieldOverlay && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            {/* Faded background */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={hideFieldOverlay}
            />
            
            {/* Field details overlay */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-300 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {fieldOverlay.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={hideFieldOverlay}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {fieldOverlay.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {field.fieldName}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {field.updateFrequency}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Data Source:</span>
                        <span className="font-medium">{field.dataSource}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retention:</span>
                        <span className="font-medium">{field.retentionDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bundle:</span>
                        <span className="font-medium capitalize">{field.bundleId}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total fields: {fieldOverlay.fields.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}