"use client";

import { Loader2Icon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ---------- EmptyView ----------

interface EmptyViewProps {
  message: string;
  onNew?: () => void;
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
      {onNew && (
        <Button size="sm" onClick={onNew}>
          <PlusIcon className="size-4 mr-2" />
          Get started
        </Button>
      )}
    </div>
  );
};

// ---------- ErrorView ----------

interface ErrorViewProps {
  message?: string;
}

export const ErrorView = ({
  message = "Something went wrong.",
}: ErrorViewProps) => {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
};

// ---------- LoadingView ----------

interface LoadingViewProps {
  message?: string;
}

export const LoadingView = ({ message = "Loading..." }: LoadingViewProps) => {
  return (
    <div className="flex items-center justify-center gap-3 py-16">
      <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

// ---------- EntitySearch ----------

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search...",
}: EntitySearchProps) => {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

// ---------- EntityHeader ----------

interface EntityHeaderProps {
  title: string;
  description?: string;
  onNew?: () => void;
  newButtonLabel?: string;
  newButtonHref?: string;
  disabled?: boolean;
}

export const EntityHeader = ({
  title,
  description,
  onNew,
  newButtonLabel = "New",
  newButtonHref,
  disabled,
}: EntityHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold capitalize">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {(onNew || newButtonHref) &&
        (newButtonHref ? (
          <Button size="sm" asChild disabled={disabled}>
            <Link href={newButtonHref}>
              <PlusIcon className="size-4 mr-2" />
              {newButtonLabel}
            </Link>
          </Button>
        ) : (
          <Button size="sm" onClick={onNew} disabled={disabled}>
            <PlusIcon className="size-4 mr-2" />
            {newButtonLabel}
          </Button>
        ))}
    </div>
  );
};

// ---------- EntityItem ----------

interface EntityItemProps {
  href: string;
  title: ReactNode;
  subtitle?: ReactNode;
  image?: ReactNode;
  onClick?: (e: MouseEvent) => void;
  isNavigating?: boolean;
  onRemove?: () => void;
  isRemoving?: boolean;
  onPrefetch?: () => void;
}

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  onClick,
  isNavigating,
  onRemove,
  isRemoving,
  onPrefetch,
}: EntityItemProps) => {
  return (
    <div className="relative group">
      <Link
        href={href}
        onClick={onClick}
        onMouseEnter={onPrefetch}
        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        aria-disabled={isNavigating}
      >
        {image && <div className="shrink-0">{image}</div>}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </Link>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity size-7"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          disabled={isRemoving}
          aria-label="Remove"
        >
          {isRemoving ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <Trash2Icon className="size-3.5" />
          )}
        </Button>
      )}
    </div>
  );
};

// ---------- EntityList ----------

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string;
  emptyView?: ReactNode;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return <>{emptyView}</>;
  }
  return (
    <div className="flex flex-col gap-y-2">
      {items.map((item) => (
        <div key={getKey(item)}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

// ---------- EntityPagination ----------

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

// ---------- EntityContainer ----------

interface EntityContainerProps {
  header: ReactNode;
  search?: ReactNode;
  pagination?: ReactNode;
  children: ReactNode;
}

export const EntityContainer = ({
  header,
  search,
  pagination,
  children,
}: EntityContainerProps) => {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search && <div>{search}</div>}
          {children}
          {pagination}
        </div>
      </div>
    </div>
  );
};
