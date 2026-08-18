import React, { ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from '@/widgets/ErrorFallback';

interface ErrorBoundaryState {
    hasError: boolean;
}

interface ErrorBoundaryProps {
    children: ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // eslint-disable-next-line no-console
        console.log(error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallback
                    title="Ой, что-то пошло не так"
                    description="Попробуйте повторить позже или вернитесь на главную страницу"
                    isFromErrorBoundary={true}
                />
            );
        }

        return this.props.children;
    }
}
