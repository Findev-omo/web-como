import { NextRequest, NextResponse } from "next/server";

export async function handler(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const apiPath = pathname.replace("/api/server", "");
  const destination = `${process.env.NEXT_PUBLIC_SERVER_URL}${apiPath}${search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  };

  if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
    fetchOptions.body = req.body;
    // @ts-ignore - This is required for streaming bodies in newer Node.js versions
    fetchOptions.duplex = "half";
  }

  try {
    const response = await fetch(destination, fetchOptions);
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers),
    });
  } catch (error) {
    console.error("[API Proxy Fetch Error]", error);
    return new NextResponse("API Proxy failed to forward request.", {
      status: 502, // Bad Gateway
    });
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
