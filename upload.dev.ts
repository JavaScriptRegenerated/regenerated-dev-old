import { createHash } from "https://deno.land/std@0.108.0/hash/mod.ts";
import { S3Bucket } from "https://deno.land/x/s3@0.4.1/mod.ts";

for await (const file of Deno.readDir('pages')) {
    const hash = createHash("sha256");
    hash.update("Your data here");
    const hashInHex = hash.toString(); // returns 5fe084ee423ff7e0c7709e9437cee89d

    const bucket = new S3Bucket({
        accessKeyID: Deno.env.get("AWS_ACCESS_KEY_ID")!,
        secretKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
        bucket: "collected-workspaces",
        region: "us-west-2",
        endpointURL: Deno.env.get("S3_ENDPOINT_URL"),
    });
}
