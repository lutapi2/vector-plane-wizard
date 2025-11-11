-- Create calculation history table
CREATE TABLE public.calculation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calculation_history ENABLE ROW LEVEL SECURITY;

-- Create policies for calculation history
CREATE POLICY "Users can view their own calculation history"
ON public.calculation_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calculation history"
ON public.calculation_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculation history"
ON public.calculation_history
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_calculation_history_user_id ON public.calculation_history(user_id);
CREATE INDEX idx_calculation_history_created_at ON public.calculation_history(created_at DESC);