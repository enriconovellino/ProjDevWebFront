import { useState } from "react";
import "@/styles/App.css";
import "@/styles/index.css";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CirclePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchSectionProps {
  title: string;
  btnText: string;
  placeholder: string;
  onAddClick?: () => void;
  onSearch?: (query: string) => void;
}

export function SearchSection({
  title,
  btnText,
  placeholder,
  onAddClick,
  onSearch,
}: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  return (
    <section className="flex flex-col gap-5 mb-5 w-full items-center">
      <div className="flex gap-40">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {title}
        </h2>
        <Button onClick={onAddClick}>
          <CirclePlus />
          {btnText}
        </Button>
      </div>
      <div className="w-full">
        <InputGroup className="h-10">
          <InputGroupInput
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={handleSearch}>
              Pesquisar
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </section>
  );
}