import { ImageEditor } from '@/components/image-editor';
import { Layout } from '@/components/Layout';

export default function ImageEditorPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Image Editor</h1>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <ImageEditor />
          </div>
        </div>
      </div>
    </Layout>
  );
}