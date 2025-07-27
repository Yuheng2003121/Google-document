"use client"
import { usePaginatedQuery, useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../convex/_generated/api'
import Loading from '@/components/Loading'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderIcon } from 'lucide-react'
import DocumentRow from './DocumentRow'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
export default function DocumentList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || '';
  
  //分页查询函数使用
  //usePaginatedQuery的 loadMore函数是​​增量加载​​（即​​追加数据​​），而不是替换原有数据!!!。
  //每次调用 loadMore时，results会包含​​之前的所有数据 + 新加载的 5 条数据​​（假设 initialNumItems: 5）。
  const {
    results: documents,
    status,
    loadMore,
  } = usePaginatedQuery(api.documents.getDocuments, {search}, { initialNumItems: 5 });
  

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
      {documents === undefined ? (
        <Loading label="Documents Loading..." />
      ) : (
        <Table className="text-gray-500">
          <TableHeader>
            <TableRow className="!hover:bg-transparent !border-0 ">
              <TableHead>Name</TableHead>
              {/* <TableHead>&nbsp;</TableHead> */}
              <TableHead className="hidden md:table-cell">Shared</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
            </TableRow>
          </TableHeader>
          {documents.length === 0 ? (
            <TableBody>
              <TableRow className="!hover:bg-transparent !border-0">
                <TableCell colSpan={2} className="h-24 text-center">
                  No documents found
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {documents.map((document) => (
                <DocumentRow key={document._id} document={document} />
              ))}
            </TableBody>
          )}
        </Table>
      )}

      <div className="mt-1 flex items-center justify-center">
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => loadMore(5)}
          disabled={status !== "CanLoadMore"}
          className="cursor-pointer text-gray-500 hover:text-black"
        >
          {status === "CanLoadMore" ? "Load More" : "No More Documents"}
        </Button>
      </div>
    </div>
  );
}
