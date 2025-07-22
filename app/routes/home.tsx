import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "이미지 마스킹 데모" },
    { name: "description", content: "이미지에 마스킹을 적용하는 React 컴포넌트 데모" },
  ];
}

export default function Home() {
  return (
    <div>
      <Welcome />
      <div className="mt-8 text-center">
        <Link
          to="/demo"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          이미지 마스킹 데모 보기
        </Link>
      </div>
    </div>
  );
}
