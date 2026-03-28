import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type SduiNodeType =
  | "container"
  | "typography"
  | "button"
  | "card"
  | "chart";

export type SduiNode = {
  id: string;
  type: SduiNodeType;
  // biome-ignore lint/suspicious/noExplicitAny: required by the requested SDUI contract
  props?: Record<string, any>;
  children?: SduiNode[];
};

type SduiRendererProps = {
  node: SduiNode;
};

const renderNodeChildren = (children?: SduiNode[]) => {
  return children?.map((child) => <SduiRenderer key={child.id} node={child} />);
};

export const SduiRenderer = ({ node }: SduiRendererProps) => {
  switch (node.type) {
    case "container": {
      return (
        <div className={node.props?.className}>
          {renderNodeChildren(node.children)}
        </div>
      );
    }

    case "typography": {
      const variant = node.props?.variant;
      const text = node.props?.text;
      const className = node.props?.className;

      if (variant === "h1") {
        return <h1 className={className ?? "text-2xl font-bold"}>{text}</h1>;
      }

      if (variant === "span") {
        return <span className={className ?? "text-sm"}>{text}</span>;
      }

      return (
        <p className={className ?? "text-sm text-muted-foreground"}>{text}</p>
      );
    }

    case "button": {
      return (
        <Button
          variant={node.props?.variant}
          className={node.props?.className}
          type="button"
        >
          {node.props?.text ?? "Action"}
        </Button>
      );
    }

    case "card": {
      return (
        <Card className={node.props?.className}>
          <CardHeader>
            <CardTitle>{node.props?.title ?? "Card Title"}</CardTitle>
          </CardHeader>
          <CardContent>
            {node.props?.description ? (
              <p className="text-sm text-muted-foreground mb-3">
                {node.props.description}
              </p>
            ) : null}
            {renderNodeChildren(node.children)}
          </CardContent>
        </Card>
      );
    }

    case "chart": {
      return (
        <div
          className={
            node.props?.className ??
            "rounded-md border border-dashed bg-muted/40 p-6 text-sm text-muted-foreground"
          }
        >
          {`📊 [Chart Placeholder: ${node.props?.chartType ?? "unknown"}]`}
        </div>
      );
    }

    default:
      return null;
  }
};
