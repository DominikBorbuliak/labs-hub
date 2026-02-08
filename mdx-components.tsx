import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const components: MDXComponents = {
  h1: ({ node: _node, ...props }) => (
    <h1
      className="text-3xl font-bold mb-4 mt-6 pb-1.5 border-b-2 border-border"
      {...props}
    />
  ),
  h2: ({ node: _node, ...props }) => (
    <h2
      className="text-2xl font-bold mb-3 mt-5 pb-1 border-b border-border"
      {...props}
    />
  ),
  h3: ({ node: _node, ...props }) => (
    <h3 className="text-xl font-semibold mb-2 mt-4" {...props} />
  ),
  h4: ({ node: _node, ...props }) => (
    <h4 className="text-lg font-semibold mb-1.5 mt-3" {...props} />
  ),
  h5: ({ node: _node, ...props }) => (
    <h5 className="text-base font-semibold mb-1 mt-2" {...props} />
  ),
  h6: ({ node: _node, ...props }) => (
    <h6 className="text-sm font-semibold mb-1 mt-2" {...props} />
  ),
  p: ({ node: _node, ...props }) => (
    <p className="mb-3 leading-normal text-foreground" {...props} />
  ),
  strong: ({ node: _node, ...props }) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: ({ node: _node, ...props }) => <em className="italic" {...props} />,
  ul: ({ node: _node, ...props }) => (
    <ul className="list-disc pl-5 mt-px mb-px [&>li]:mt-px" {...props} />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol className="list-decimal pl-5 mt-px mb-px [&>li]:mt-px" {...props} />
  ),
  li: ({ node: _node, ...props }) => (
    <li className="leading-normal mb-0" {...props} />
  ),
  a: ({ node: _node, ...props }) => (
    <a
      className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
      {...props}
    />
  ),
  code: ({ node: _node, ...props }) => {
    const { className, children, ...rest } = props;
    if (className?.includes("hljs")) {
      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded-md text-sm font-mono"
        {...rest}
      >
        {children}
      </code>
    );
  },
  pre: ({ node: _node, ...props }) => (
    <pre
      className="bg-primary text-primary-foreground p-3 rounded-lg overflow-x-auto mb-4 shadow-lg"
      {...props}
    />
  ),
  blockquote: ({ node: _node, ...props }) => (
    <blockquote
      className="border-l-4 border-primary bg-muted pl-3 pr-3 py-1.5 italic my-4 text-muted-foreground"
      {...props}
    />
  ),
  hr: ({ node: _node, ...props }) => (
    <Separator className="my-5" {...props} />
  ),
  table: ({ node: _node, ...props }) => (
    <Table className="mb-4" {...props} />
  ),
  thead: ({ node: _node, ...props }) => <TableHeader {...props} />,
  tbody: ({ node: _node, ...props }) => <TableBody {...props} />,
  tr: ({ node: _node, ...props }) => <TableRow {...props} />,
  th: ({ node: _node, ...props }) => <TableHead {...props} />,
  td: ({ node: _node, ...props }) => <TableCell {...props} />,
  img: ({ node: _node, ...props }) => {
    const { alt, width, height, ...rest } = props;

    return (
      <Image
        alt={alt}
        width={Number(width) || 800}
        height={Number(height) || 400}
        className="rounded-lg shadow-md"
        style={{ width: "100%", height: "auto" }}
        {...(rest as Omit<ImageProps, "alt">)}
      />
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
