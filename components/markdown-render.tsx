import { ClipboardIcon } from '@heroicons/react/outline';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import ExternalLink from './external-link';

import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff';
import DocAlert from './doc-alert';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('ts', ts);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('diff', diff);

type Props = {
  data: string;
};

const MarkdownRender = ({ data }: Props) => {
  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkBreaks,
        remarkGfm,
        remarkDirective,
        remarkDirectiveRehype,
      ]}
      className="prose prose-pre:p-0 dark:prose-invert"
      transformImageUri={(src) => {
        if (process.env.NODE_ENV === 'production') {
          return `/stripe-doc` + src;
        } else {
          return src;
        }
      }}
      components={{
        a({ href, children }) {
          return <ExternalLink href={href!}>{children}</ExternalLink>;
        },
        pre({ children }) {
          return (
            <pre className="first:mt-0 last:mb-0 overflow-hidden shadow">
              {children}
            </pre>
          );
        },
        ['info' as keyof JSX.IntrinsicElements]: DocAlert,
        ['warning' as keyof JSX.IntrinsicElements]: DocAlert,
        ['important' as keyof JSX.IntrinsicElements]: DocAlert,
        img({ src }) {
          return (
            <a href={src} target="_blank" rel="noreferrer">
              <img
                src={src}
                className="rounded-md shadow overflow-hidden block"
                alt=""
              />
            </a>
          );
        },
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const fileName = className?.split(':')?.[1];
          return !inline && match ? (
            <div>
              {fileName && (
                <div className="bg-[#1f192c] border-b flex items-center justify-between border-black text-sm py-2 px-3 text-white">
                  <span className="opacity-60">{fileName}</span>
                  <CopyToClipboard
                    onCopy={() =>
                      toast.success('コピーしました', {
                        position: 'bottom-center',
                      })
                    }
                    text={String(children)}
                  >
                    <button>
                      <ClipboardIcon className="w-6 h-6 text-gray-500" />
                    </button>
                  </CopyToClipboard>
                </div>
              )}
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{ margin: 0 }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code {...props}>{children}</code>
          );
        },
      }}
    >
      {data}
    </ReactMarkdown>
  );
};

export default MarkdownRender;
