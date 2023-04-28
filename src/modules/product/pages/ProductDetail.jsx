import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loading from "../../common/components/Loading";
import supabase from "../../../config/supabase";

export default function ProductDetail() {
  const { productId } = useParams();

  const {
    isLoading,
    data: product,
    error,
  } = useQuery({
    queryKey: ["products", productId],
    queryFn: () =>
      supabase.from("product").select().eq("id", productId).single(),
    select: (res) => res.data,
  });

  if (isLoading) return <Loading />;

  console.log(product);

  return <div>ProductDetail {productId}</div>;
}
