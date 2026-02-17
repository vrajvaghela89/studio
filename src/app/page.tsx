"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Wand2, Film, Sparkles } from "lucide-react";

import { generateReelHooks } from "@/ai/flows/generate-reel-hooks-flow";
import { generateDetailedReelDescriptions } from "@/ai/flows/generate-detailed-reel-descriptions-flow";
import { useToast } from "@/hooks/use-toast";
import { FormattedContent } from "@/components/formatted-content";

const formSchema = z.object({
  reelIdea: z
    .string()
    .min(10, {
      message: "Please enter a reel idea of at least 10 characters.",
    })
    .max(200, {
      message: "Reel idea cannot be longer than 200 characters.",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Home() {
  const [hooks, setHooks] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [loadingHooks, setLoadingHooks] = useState(false);
  const [loadingDescriptions, setLoadingDescriptions] = useState<
    Record<string, boolean>
  >({});
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reelIdea: "",
    },
  });

  const handleGenerate = async (values: FormSchema) => {
    setLoadingHooks(true);
    setHooks([]);
    setDescriptions({});
    try {
      const result = await generateReelHooks({ reelIdea: values.reelIdea });
      setHooks(result.hooks);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Generating Hooks",
        description:
          "There was a problem generating hooks for your idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingHooks(false);
    }
  };

  const handleAccordionChange = async (value: string) => {
    if (!value || descriptions[value] || loadingDescriptions[value]) {
      return;
    }

    setLoadingDescriptions((prev) => ({ ...prev, [value]: true }));
    try {
      const result = await generateDetailedReelDescriptions({ reelHook: value });
      setDescriptions((prev) => ({
        ...prev,
        [value]: result.detailedDescription,
      }));
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Generating Description",
        description:
          "There was a problem generating the detailed description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingDescriptions((prev) => ({ ...prev, [value]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <main className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <header className="text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Film className="w-12 h-12 text-primary" />
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
              ReelGenius
            </h1>
          </div>
          <p className="text-muted-foreground text-lg md:text-xl">
            Your AI-powered assistant for viral reel content
          </p>
        </header>

        <section className="mt-12">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                <Sparkles className="w-6 h-6 text-accent" />
                Create Your Next Viral Reel
              </CardTitle>
              <CardDescription>
                Enter a brief idea and let our AI generate catchy hooks and detailed production guides.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleGenerate)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="reelIdea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold font-headline">
                          Your Reel Idea
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., A quick tutorial on making the perfect iced coffee at home"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={loadingHooks}
                    className="w-full md:w-auto"
                    size="lg"
                  >
                    {loadingHooks ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-5 w-5" />
                    )}
                    Generate Hooks
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>

        {loadingHooks && (
          <div className="flex flex-col items-center justify-center text-center mt-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground text-lg font-semibold">
              Generating amazing hooks...
            </p>
          </div>
        )}

        {hooks.length > 0 && (
          <section className="mt-12 transition-opacity duration-500 animate-in fade-in">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Generated Hooks</CardTitle>
                <CardDescription>
                  Click on a hook to reveal a detailed guide for shooting and editing your reel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  onValueChange={handleAccordionChange}
                >
                  {hooks.map((hook, index) => (
                    <AccordionItem value={hook} key={index}>
                      <AccordionTrigger className="text-left text-lg hover:no-underline">
                        <span className="font-semibold">{index + 1}.</span> {hook}
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        {loadingDescriptions[hook] && (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Generating detailed guide...</span>
                          </div>
                        )}
                        {descriptions[hook] && (
                          <FormattedContent text={descriptions[hook]} />
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
