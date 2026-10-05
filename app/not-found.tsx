import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="font-serif text-4xl">这页还没有</h1>
      <p className="mt-4 text-ink/70">要加一章新的工具，在注册表挂上节点即可。现在可以回到已有的路径。</p>
      <p className="mt-6 flex gap-4">
        <Link href="/learn/vectors" className="text-copper">
          从向量开始
        </Link>
        <Link href="/tools" className="text-copper">
          打开导图
        </Link>
      </p>
    </main>
  );
}
