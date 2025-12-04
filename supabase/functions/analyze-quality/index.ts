import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, notes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing image:', imageUrl);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert food quality inspector AI. Analyze images of raw food materials and provide quality assessments.
            
You must respond with a JSON object containing:
- qualityScore: number 0-100 (overall quality)
- freshnessScore: number 0-100 (freshness level)
- defectScore: number 0-100 (percentage of visible defects)
- analysis: string (detailed analysis of the image, including observations about color, texture, freshness indicators, any visible defects, storage recommendations, and overall assessment)

Be thorough but concise in your analysis. Focus on practical insights for food processing operations.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please analyze this food quality image and provide scores and detailed analysis.${notes ? ` Additional context: ${notes}` : ''}`
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'provide_quality_assessment',
              description: 'Provide a quality assessment for food materials',
              parameters: {
                type: 'object',
                properties: {
                  qualityScore: {
                    type: 'number',
                    description: 'Overall quality score from 0-100'
                  },
                  freshnessScore: {
                    type: 'number',
                    description: 'Freshness score from 0-100'
                  },
                  defectScore: {
                    type: 'number',
                    description: 'Defect percentage from 0-100'
                  },
                  analysis: {
                    type: 'string',
                    description: 'Detailed analysis of the food quality'
                  }
                },
                required: ['qualityScore', 'freshnessScore', 'defectScore', 'analysis']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'provide_quality_assessment' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI Response:', JSON.stringify(data, null, 2));

    // Extract the tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fallback: try to extract from content
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (e) {
        console.error('Failed to parse content as JSON:', e);
      }
    }

    // Default response if parsing fails
    return new Response(JSON.stringify({
      qualityScore: 75,
      freshnessScore: 70,
      defectScore: 10,
      analysis: 'Unable to fully analyze the image. Please ensure the image is clear and shows the food material properly.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-quality function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
