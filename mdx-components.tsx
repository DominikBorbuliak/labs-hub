import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

const components: MDXComponents = {
  h1: ({ node: _node, ...props }) => (
    <h1
      className="text-4xl font-bold mb-6 mt-8 pb-2 border-b-2 border-gray-200"
      {...props}
    />
  ),
  h2: ({ node: _node, ...props }) => (
    <h2
      className="text-3xl font-bold mb-4 mt-8 pb-2 border-b border-gray-200"
      {...props}
    />
  ),
  h3: ({ node: _node, ...props }) => (
    <h3 className="text-2xl font-semibold mb-3 mt-6" {...props} />
  ),
  h4: ({ node: _node, ...props }) => (
    <h4 className="text-xl font-semibold mb-2 mt-4" {...props} />
  ),
  h5: ({ node: _node, ...props }) => (
    <h5 className="text-lg font-semibold mb-2 mt-3" {...props} />
  ),
  h6: ({ node: _node, ...props }) => (
    <h6 className="text-base font-semibold mb-2 mt-3" {...props} />
  ),
  p: ({ node: _node, ...props }) => (
    <p className="mb-4 leading-relaxed text-gray-800" {...props} />
  ),
  strong: ({ node: _node, ...props }) => (
    <strong className="font-semibold text-gray-900" {...props} />
  ),
  em: ({ node: _node, ...props }) => <em className="italic" {...props} />,
  ul: ({ node: _node, ...props }) => (
    <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol className="list-decimal pl-6 mb-6 space-y-2" {...props} />
  ),
  li: ({ node: _node, ...props }) => (
    <li className="leading-relaxed" {...props} />
  ),
  a: ({ node: _node, ...props }) => (
    <a
      className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
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
        className="bg-gray-50 text-gray-700 border border-gray-300 px-1.5 py-0.5 rounded text-sm font-mono"
        {...rest}
      >
        {children}
      </code>
    );
  },
  pre: ({ node: _node, ...props }) => (
    <pre
      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6 shadow-lg"
      {...props}
    />
  ),
  blockquote: ({ node: _node, ...props }) => (
    <blockquote
      className="border-l-4 border-blue-500 bg-blue-50 pl-4 pr-4 py-2 italic my-6 text-gray-700"
      {...props}
    />
  ),
  hr: ({ node: _node, ...props }) => (
    <hr className="my-8 border-t-2 border-gray-300" {...props} />
  ),
  table: ({ node: _node, ...props }) => (
    <div className="overflow-x-auto mb-6">
      <table
        className="min-w-full border-collapse border border-gray-300"
        {...props}
      />
    </div>
  ),
  thead: ({ node: _node, ...props }) => (
    <thead className="bg-gray-100" {...props} />
  ),
  tbody: ({ node: _node, ...props }) => <tbody {...props} />,
  tr: ({ node: _node, ...props }) => (
    <tr className="border-b border-gray-300" {...props} />
  ),
  th: ({ node: _node, ...props }) => (
    <th
      className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900"
      {...props}
    />
  ),
  td: ({ node: _node, ...props }) => (
    <td className="border border-gray-300 px-4 py-2 text-gray-800" {...props} />
  ),
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
